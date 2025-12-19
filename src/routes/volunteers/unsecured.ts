import { Router } from 'express';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { EmailManager } from '@src/services/email-service/email-manager';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { IEmailManager } from '@src/domain/interfaces/repositories/email-manager';
import { getContainer } from '../helpers/get-container';
import { validateRequest } from '@src/presentation/middlewares/validate-request';
import { z } from 'zod';
import { ApiError } from '@src/presentation/types/api-error';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { SendEmailError } from '@src/domain/errors/send-email';
import { JWT_SECRET_KEY, HELPDESK_EMAIL, INFO_EMAIL } from '@src/config/server';
import { decrypt } from '@src/helpers/message-encryption';
import { checkPlainWithHash } from '@src/helpers/message-hashing';
import { sign } from 'jsonwebtoken';
import { VolunteerJWTPayload } from '@src/presentation/types/volunteer-jwt-payload';
import { PermissionEntity } from '@src/domain/entities/volunteer/permission-entity';
import { sendEmailToSupport } from '@src/services/email-service/use-cases/send-email-to-support';
import { sendEmailToVolunteer } from '@src/services/email-service/use-cases/send-password-email';
import { sendVolunteerCreatedEmail } from '@src/services/email-service/use-cases/send-volunteer-create-email';
import { SupportEmailSendData } from '@src/services/email-service/types/support-email-send-data';
import { CreateVolunteerEntity } from '@src/domain/entities/volunteer/create-volunteer-entity';

const router = Router();

const getRepositories = () => {
  const container = getContainer();
  const volunteerRepository = container.get<VolunteerRepository>(
    SequelizeVolunteerRepository
  );
  const emailManager = container.get<IEmailManager>(EmailManager);
  return { volunteerRepository, emailManager };
};

// HEAD /volunteers/:email
router.head(
  '/:email',
  validateRequest({
    params: z.object({
      email: z.string().email()
    })
  }),
  async (req, res, next) => {
    try {
      const { email } = req.params;
      const { volunteerRepository } = getRepositories();
      const volunteer = await volunteerRepository.getVolunteerByEmail(email);

      if (!volunteer) {
        throw new ApiError(
          404,
          new VolunteerError({
            name: 'VOLUNTEER_NOT_FOUND',
            message: `Volunteer with email ${email} not found`
          })
        );
      }
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /volunteers/password
router.patch(
  '/password',
  validateRequest({
    body: z.object({
      password: z.string(),
      hashEmail: z.string()
    })
  }),
  async (req, res, next) => {
    try {
      const { password, hashEmail } = req.body;
      const { volunteerRepository } = getRepositories();
      const email = decrypt(hashEmail);

      const success = await volunteerRepository.updateOrCreatePasswordForEmail(
        email,
        password
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
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

// POST /volunteers/login
router.post(
  '/login',
  validateRequest({
    body: z.object({
      email: z.string().email(),
      password: z.string()
    })
  }),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { volunteerRepository } = getRepositories();
      const volunteerWithAuth =
        await volunteerRepository.getVolunteerWithAuthDataByEmail(email);

      if (
        volunteerWithAuth &&
        checkPlainWithHash(password, volunteerWithAuth.password)
      ) {
        let permissions: PermissionEntity | null = null;

        if (volunteerWithAuth.authorPermission) {
          permissions = await volunteerRepository.getPermissionByAuthName(
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

        const token = sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' });
        res.status(200).json({ token: token, volunteer });
      } else if (volunteerWithAuth) {
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
    } catch (error) {
      next(error);
    }
  }
);

// POST /volunteers
router.post('/', async (req, res, next) => {
  try {
    const volunteer = req.body as CreateVolunteerEntity;
    const { idpep } = req.query;
    const { volunteerRepository, emailManager } = getRepositories();

    try {
      if (idpep) {
        volunteer.pep = Number(idpep);
      }
      const createdVolunteer = await volunteerRepository.createVolunteer(
        volunteer
      );

      await sendVolunteerCreatedEmail(emailManager, {
        email: createdVolunteer.email,
        idvol: createdVolunteer.idvol,
        name: createdVolunteer.name,
        pep: createdVolunteer.pep
      });

      if (idpep) {
        createdVolunteer.pep = Number(idpep);
      }
      res.status(201).json(createdVolunteer);
    } catch (error) {
      throw new ApiError(400, error as VolunteerError);
    }
  } catch (error) {
    next(error);
  }
});

// POST /volunteers/help-email
router.post('/help-email', async (req, res, next) => {
  try {
    const helpEmailData = req.body as SupportEmailSendData;
    const { emailManager } = getRepositories();
    try {
      await sendEmailToSupport(emailManager, helpEmailData, HELPDESK_EMAIL);
      res.status(200).json({ message: 'Successfully sent help email' });
    } catch (error) {
      throw new ApiError(400, error as SendEmailError);
    }
  } catch (error) {
    next(error);
  }
});

// POST /volunteers/contact-email
router.post('/contact-email', async (req, res, next) => {
  try {
    const contactEmailData = req.body as SupportEmailSendData;
    const { emailManager } = getRepositories();
    try {
      await sendEmailToSupport(emailManager, contactEmailData, INFO_EMAIL);
      res.status(200).json({ message: 'Successfully sent contact email' });
    } catch (error) {
      throw new ApiError(400, error as SendEmailError);
    }
  } catch (error) {
    next(error);
  }
});

// POST /volunteers/password-email
router.post(
  '/password-email',
  validateRequest({
    body: z.object({
      email: z.string().email()
    })
  }),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const { volunteerRepository, emailManager } = getRepositories();
      const volunteer = await volunteerRepository.getVolunteerByEmail(email);

      if (!volunteer)
        throw new ApiError(
          404,
          new VolunteerError({
            name: 'VOLUNTEER_NOT_FOUND',
            message: `Volunteer with email ${email} not found`
          })
        );

      try {
        await sendEmailToVolunteer(emailManager, email);
        res
          .status(200)
          .json({ message: 'Successfully sent the email to the volunteer' });
      } catch (error) {
        throw new ApiError(400, error as SendEmailError);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
