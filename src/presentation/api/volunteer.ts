import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '@src/config/server';
import { VolunteerJWTPayload } from '../types/volunteer-jwt-payload';
import { VolunteerWithAuthEntity } from '@src/domain/entities/volunteer-with-auth-entity';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { AuthError } from '@src/domain/errors/auth';
import {
  Body,
  Controller,
  Delete,
  FieldErrors,
  Get,
  Patch,
  Path,
  Post,
  Put,
  Res,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
  TsoaResponse
} from 'tsoa';
import { inject } from 'inversify';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { provide } from 'inversify-binding-decorators';
import { UpdateVolunteerEntity } from '@src/domain/entities/update-volunteer-entity';
import { sendEmailToVolunteer } from '@src/services/email-service/sendPasswordEmail';
import { VolunteerAuthDataEntity } from '@src/domain/entities/volunteer-auth-entity';
import { checkPlainWithHash } from '@src/helpers/message-hashing';
import { decrypt } from '@src/helpers/message-encryption';

@Route('volunteers')
@Response<{ message: string; details: FieldErrors }>(422, 'Validation Error')
@provide(VolunteerAPI)
@Tags('Volunteer')
export class VolunteerAPI extends Controller {
  private volunteerRepository: VolunteerRepository;

  constructor(
    @inject(SequelizeVolunteerRepository)
    volunteerRepository: VolunteerRepository
  ) {
    super();
    this.volunteerRepository = volunteerRepository;
  }

  /**
   * Create the volunteer password if it does not exist or udpdate it.
   *
   * IMPORTANT: That route differently from the PUT /{email}/password
   * receives a hashed email, that email should only be retrieved from the POST /password-email
   * link send to the volunteer email. Furthermore, this route does not have authentication
   * as the email is hashed.
   */
  @Patch('password')
  @SuccessResponse(204, 'Password Successfully created or updated')
  async createOrUpdatePasswordForHashEmail(
    @Body() createOrUpatePassData: { password: string; hashEmail: string },
    @Res() volunteerErrorRes: TsoaResponse<400, VolunteerError>
  ): Promise<void> {
    const email = decrypt(createOrUpatePassData.hashEmail);

    const success =
      await this.volunteerRepository.updateOrCreatePasswordForEmail(
        email,
        createOrUpatePassData.password
      );

    if (!success) {
      return volunteerErrorRes(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message:
            'Could not create or update volunteer password because it was not found'
        })
      );
    }
  }

  /**
   * Create the volunteer password if it does not exist or udpdate it.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Patch('{email}/password')
  @Security('jwt')
  @SuccessResponse(204, 'Password Successfully created or updated')
  async createOrUpdatePassword(
    @Path() email: string,
    @Body() passwordWrapper: Pick<VolunteerAuthDataEntity, 'password'>,
    @Res() volunteerErrorRes: TsoaResponse<400, VolunteerError>
  ): Promise<void> {
    const success =
      await this.volunteerRepository.updateOrCreatePasswordForEmail(
        email,
        passwordWrapper.password
      );

    if (!success) {
      return volunteerErrorRes(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message:
            'Could not create or update volunteer password because it was not found'
        })
      );
    }
  }

  /**
   * Generate an access token for the volunteer if his login data is correct
   */
  @Post('login')
  @SuccessResponse(200, 'Success Login')
  async login(
    @Body() loginData: Pick<VolunteerAuthDataEntity, 'password' | 'email'>,
    @Res() authErrorRes: TsoaResponse<400, AuthError>
  ): Promise<{ token: string }> {
    const volunteer =
      await this.volunteerRepository.getVolunteerWithAuthDataByEmail(
        loginData.email
      );

    if (
      volunteer &&
      checkPlainWithHash(loginData.password, volunteer.password)
    ) {
      const payload: VolunteerJWTPayload = {
        email: volunteer.email,
        bookPermission: volunteer.bookPermission,
        authorPermission: volunteer.authorPermission,
        certificationPermission: volunteer.certificationPermission,
        readPermission: volunteer.readPermission
      };
      const token = sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
      return { token: token };
    } else {
      return authErrorRes(
        400,
        new AuthError({
          name: 'EMAIL_OR_PASSWORD_WRONG_ERROR',
          message: 'Email or Password wrong'
        })
      );
    }
  }

  /**
   * Update the volunteer.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Put('{email}')
  @Security('jwt')
  @SuccessResponse(200, 'Volunteer successfully updated')
  async updateVolunteer(
    @Path() email: string,
    @Body() volunteer: UpdateVolunteerEntity,
    @Res() volunteerErrorRes: TsoaResponse<400, VolunteerError>
  ): Promise<VolunteerEntity> {
    const updatedVolunteer = await this.volunteerRepository.updateVolunteer(
      volunteer,
      email
    );

    if (!updatedVolunteer) {
      return volunteerErrorRes(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_UPDATED',
          message: `Volunteer with email ${email} not updated`
        })
      );
    }

    return updatedVolunteer;
  }

  /**
   * Create the volunteer
   */
  @Post()
  @SuccessResponse(201, 'Volunteer Created')
  async createVolunteer(
    @Body() volunteer: VolunteerWithAuthEntity,
    @Res() volunteerErrorRes: TsoaResponse<400, VolunteerError>
  ): Promise<VolunteerEntity> {
    try {
      const createdVolunteer = await this.volunteerRepository.createVolunteer(
        volunteer
      );
      return createdVolunteer;
    } catch (error) {
      return volunteerErrorRes(400, error as VolunteerError);
    }
  }

  /**
   * Get the volunteer by email.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Get('{email}')
  @Security('jwt')
  @SuccessResponse(200, 'Get volunteer by specified email')
  async getVolunteerByEmail(
    @Path() email: string,
    @Res() volunteerErrorRes: TsoaResponse<400, VolunteerError>
  ): Promise<VolunteerEntity> {
    const volunteer = await this.volunteerRepository.getVolunteerByEmail(email);

    if (!volunteer)
      return volunteerErrorRes(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message: `Volunteer with email ${email} not found`
        })
      );

    return volunteer;
  }

  /**
   * Delete the volunteer.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Delete('{email}')
  @Security('jwt')
  @SuccessResponse(204, 'Successfully deleted volunteer')
  async deleteVolunteer(
    @Path() email: string,
    @Res() volunteerErrorRes: TsoaResponse<400, VolunteerError>
  ): Promise<void> {
    const volunteerIsDeleted =
      await this.volunteerRepository.deleteVolunteerByEmail(email);

    if (!volunteerIsDeleted)
      return volunteerErrorRes(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_DELETED',
          message: `Volunteer with email ${email} not deleted`
        })
      );
  }

  /**
   * Sends an email to the volunteer with a link for creating or update a forgotten password.
   *
   * The link contains the user email hash in the path as the following format:
   *
   * GET /{reset-password-route}/{email-hash}
   *
   */
  @Post('password-email')
  @SuccessResponse(200, 'Successfully sent the email to the volunteer')
  async sendCreatePasswordEmail(
    @Body() emailWrapper: Pick<VolunteerAuthDataEntity, 'email'>,
    @Res() volunteerErrorRes: TsoaResponse<400, VolunteerError>
  ): Promise<void> {
    const volunteer = await this.volunteerRepository.getVolunteerByEmail(
      emailWrapper.email
    );

    if (!volunteer)
      return volunteerErrorRes(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message: `Volunteer with email ${emailWrapper.email} not found`
        })
      );

    await sendEmailToVolunteer(emailWrapper.email);
  }
}
