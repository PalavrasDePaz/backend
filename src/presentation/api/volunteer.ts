import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { VolunteerEntity } from '@src/domain/entities/volunteer-entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '@src/config/server';
import { checkPasswordWithHash } from '@src/helpers/password_hashing';
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

type LoginData = {
  email: string;
  password: string;
};

type PasswordWrapper = {
  password: string;
};

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
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Put('{email}/password')
  @Security('jwt')
  @SuccessResponse(204, 'Password Successfully created or updated')
  async createOrUpdatePassword(
    @Path() email: string,
    @Body() passwordWrapper: PasswordWrapper,
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
    @Body() loginData: LoginData,
    @Res() authErrorRes: TsoaResponse<400, AuthError>
  ): Promise<{ token: string }> {
    const volunteer =
      await this.volunteerRepository.getVolunteerWithAuthDataByEmail(
        loginData.email
      );

    if (
      volunteer &&
      checkPasswordWithHash(loginData.password, volunteer.password)
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
}
