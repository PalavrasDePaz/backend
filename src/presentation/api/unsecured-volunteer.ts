import { HELPDESK_EMAIL, INFO_EMAIL, JWT_SECRET_KEY } from '@src/config/server';
import { validationExample } from '@src/documentation/validation-example';
import { CreateVolunteerEntity } from '@src/domain/entities/volunteer/create-volunteer-entity';
import { PermissionEntity } from '@src/domain/entities/volunteer/permission-entity';
import { VolunteerAuthDataEntity } from '@src/domain/entities/volunteer/volunteer-auth-entity';
import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';
import { SendEmailError } from '@src/domain/errors/send-email';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { IEmailManager } from '@src/domain/interfaces/repositories/email-manager';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { decrypt } from '@src/helpers/message-encryption';
import { checkPlainWithHash } from '@src/helpers/message-hashing';
import { EmailManager } from '@src/services/email-service/email-manager';
import { SupportEmailSendData } from '@src/services/email-service/types/support-email-send-data';
import { sendEmailToSupport } from '@src/services/email-service/use-cases/send-email-to-support';
import { sendEmailToVolunteer } from '@src/services/email-service/use-cases/send-password-email';
import { sendVolunteerCreatedEmail } from '@src/services/email-service/use-cases/send-volunteer-create-email';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { sign } from 'jsonwebtoken';
import {
  Body,
  Controller,
  FieldErrors,
  Head,
  Patch,
  Path,
  Post,
  Query,
  Response,
  Route,
  SuccessResponse,
  Tags
} from 'tsoa';
import { ApiError } from '../types/api-error';
import { VolunteerJWTPayload } from '../types/volunteer-jwt-payload';

@Route('volunteers')
@Response<{ message: string; details: FieldErrors }>(
  422,
  'Validation Error',
  validationExample
)
@Tags('Volunteer')
@provide(UnsecuredVolunteerAPI)
export class UnsecuredVolunteerAPI extends Controller {
  private volunteerRepository: VolunteerRepository;
  private emailManager: IEmailManager;

  constructor(
    @inject(SequelizeVolunteerRepository)
    volunteerRepository: VolunteerRepository,
    @inject(EmailManager)
    emailManager: IEmailManager
  ) {
    super();
    this.volunteerRepository = volunteerRepository;
    this.emailManager = emailManager;
  }

  /**
   * Check if the email already exists on the system.
   *
   */
  @Head('{email}')
  @SuccessResponse(200, 'The email exists')
  @Response<VolunteerError>(404, 'Could not find the email')
  async checkExistingEmail(@Path() email: string): Promise<void> {
    const volunteer = await this.volunteerRepository.getVolunteerByEmail(email);

    if (!volunteer)
      throw new ApiError(
        404,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message: `Volunteer with email ${email} not found`
        })
      );
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
  @Response<VolunteerError>(400, 'Could not find volunteer')
  async createOrUpdatePasswordForHashEmail(
    @Body() createOrUpatePassData: { password: string; hashEmail: string }
  ): Promise<void> {
    const email = decrypt(createOrUpatePassData.hashEmail);

    const success =
      await this.volunteerRepository.updateOrCreatePasswordForEmail(
        email,
        createOrUpatePassData.password
      );

    if (!success) {
      throw new ApiError(
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
   *
   * Example of token with all permissions:
   *
   * {
   *
   *   "email": "test@gmail.com",
   *
   *   "idvol": 1,
   *
   *   "bookPermission": true,
   *
   *   "readPermission": true,
   *
   *   "attendanceModulePermission": true,
   *
   *   "manageVolunteerModulePermission": true,
   *
   *   "determineVolunteerModulePermission": true,
   *
   *   "essayModulePermission": true,
   *
   *   "notebookModulePermission": true,
   *
   *   "iat": 1691699195,
   *
   *   "exp": 1691706395
   *
   * }
   *
   */
  @Post('login')
  @SuccessResponse(200, 'Success Login')
  @Response<VolunteerError>(400, 'Wrong email or password', {
    name: 'PASSWORD_WRONG_ERROR',
    message: 'Password wrong'
  })
  @Response<VolunteerError>(400, 'Wrong email or password', {
    name: 'VOLUNTEER_UNREGISTERED',
    message: 'Volunteer unregistered'
  })
  async login(
    @Body() loginData: Pick<VolunteerAuthDataEntity, 'password' | 'email'>
  ): Promise<{ token: string; volunteer: VolunteerEntity }> {
    const volunteerWithAuth =
      await this.volunteerRepository.getVolunteerWithAuthDataByEmail(
        loginData.email
      );
    if (
      volunteerWithAuth &&
      checkPlainWithHash(loginData.password, volunteerWithAuth.password)
    ) {
      let permissions: PermissionEntity | null = null;

      if (volunteerWithAuth.authorPermission) {
        permissions = await this.volunteerRepository.getPermissionByAuthName(
          volunteerWithAuth.authorPermission
        );
      }
      const {
        bookPermission,
        certificationPermission,
        password: _password,
        readPermission,
        ...volunteer
      } = volunteerWithAuth;
      const payload: VolunteerJWTPayload = {
        email: volunteer.email,
        idvol: volunteer.idvol,
        bookPermission: bookPermission ? true : undefined,
        certificationPermission: certificationPermission ? true : undefined,
        readPermission: readPermission ? true : undefined,
        ...permissions?.permissions
      };

      const token = sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' });
      return { token: token, volunteer };
    }
    if (volunteerWithAuth) {
      throw new ApiError(
        400,
        new VolunteerError({
          name: 'PASSWORD_WRONG_ERROR',
          message: 'Password wrong'
        })
      );
    } else {
      throw new ApiError(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_UNREGISTERED',
          message: 'Volunteer unregistered'
        })
      );
    }
  }

  /**
   * Create the volunteer. If the operation is successfully, an email will be
   * sent to the volunteer attesting that the account was created
   */
  @Post()
  @SuccessResponse(201, 'Volunteer Created')
  @Response<VolunteerError>(400, 'Volunteer already exists', {
    name: 'VOLUNTEER_ALREADY_EXISTS',
    message: 'Volunteer with email {some email} already exists'
  })
  async createVolunteer(
    @Body() volunteer: CreateVolunteerEntity,
    @Query() idpep?: number
  ): Promise<VolunteerEntity> {
    try {
      if (idpep) {
        volunteer.pep = idpep;
      }
      const createdVolunteer = await this.volunteerRepository.createVolunteer(
        volunteer
      );

      await sendVolunteerCreatedEmail(this.emailManager, {
        email: createdVolunteer.email,
        idvol: createdVolunteer.idvol,
        name: createdVolunteer.name,
        pep: createdVolunteer.pep
      });

      if (idpep) {
        createdVolunteer.pep = idpep;
      }
      return createdVolunteer;
    } catch (error) {
      throw new ApiError(400, error as VolunteerError);
    }
  }

  /**
   * Sends email from volunteer to helpdesk email
   */
  @Post('help-email')
  @SuccessResponse(200, 'Successfully sent help email')
  @Response<SendEmailError>(400, 'Could not send email')
  async sendHelpEmail(@Body() helpEmailData: SupportEmailSendData) {
    try {
      await sendEmailToSupport(
        this.emailManager,
        helpEmailData,
        HELPDESK_EMAIL
      );
    } catch (error) {
      throw new ApiError(400, error as SendEmailError);
    }
  }

  /**
   * Sends email from volunteer to contact email
   */
  @Post('contact-email')
  @SuccessResponse(200, 'Successfully sent help email')
  @Response<SendEmailError>(400, 'Could not send email')
  async sendContactEmail(@Body() contactEmailData: SupportEmailSendData) {
    try {
      await sendEmailToSupport(this.emailManager, contactEmailData, INFO_EMAIL);
    } catch (error) {
      throw new ApiError(400, error as SendEmailError);
    }
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
  @Response<VolunteerError>(404, 'Could not find volunteer')
  @Response<SendEmailError>(400, 'Could not send email')
  async sendCreatePasswordEmail(
    @Body() emailWrapper: Pick<VolunteerAuthDataEntity, 'email'>
  ): Promise<void> {
    const volunteer = await this.volunteerRepository.getVolunteerByEmail(
      emailWrapper.email
    );

    if (!volunteer)
      throw new ApiError(
        404,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message: `Volunteer with email ${emailWrapper.email} not found`
        })
      );

    try {
      await sendEmailToVolunteer(this.emailManager, emailWrapper.email);
    } catch (error) {
      throw new ApiError(400, error as SendEmailError);
    }
  }
}
