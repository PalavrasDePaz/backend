import { Router } from 'express';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { EmailManager } from '@src/services/email-service/email-manager';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { IEmailManager } from '@src/domain/interfaces/repositories/email-manager';
import { getContainer } from '../helpers/get-container';
import {
  authenticateMiddleware,
  AuthenticatedRequest
} from '@src/presentation/middlewares/auth-middleware';
import { paginationMiddleware } from '@src/presentation/middlewares/paginationMiddleware';
import { validateRequest } from '@src/presentation/middlewares/validate-request';
import { z } from 'zod';
import moment from 'moment';
import xlsx from 'xlsx';
import { Readable } from 'stream';
import { logger } from '@src/services/logger/logger';
import { ApiError } from '@src/presentation/types/api-error';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { sendVolunteerCreatedEmail } from '@src/services/email-service/use-cases/send-volunteer-create-email';
import { UpdateVolunteerEntity } from '@src/domain/entities/volunteer/update-volunteer-entity';
import { PostVolunteerHoursEntity } from '@src/domain/entities/volunteer/post-volunteer-hours-entity';

const router = Router();

const getRepositories = () => {
  const container = getContainer();
  const volunteerRepository = container.get<VolunteerRepository>(
    SequelizeVolunteerRepository
  );
  const emailManager = container.get<IEmailManager>(EmailManager);
  return { volunteerRepository, emailManager };
};

// GET /volunteers/download/from/:date
router.get(
  '/download/from/:date',
  authenticateMiddleware(['determineVolunteerModulePermission']),
  validateRequest({
    params: z.object({
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format yyyy-mm-dd')
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { date } = req.params;
      const { volunteerRepository } = getRepositories();
      const dateFormated = new Date(date);
      const volunteers =
        await volunteerRepository.getVolunteersDownloadFromDate(dateFormated);

      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(volunteers);
      xlsx.utils.book_append_sheet(wb, ws, `volunteers-${date}.xlsx`);
      const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + `volunteers.xlsx`
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Length', xlsxBuffer.byteLength);

      const stream = Readable.from(xlsxBuffer);

      stream.on('error', (error) => {
        logger.error(error);
      });

      stream.on('close', () => {
        logger.info('Closing stream');
      });

      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }
);

// GET /volunteers/from/:date
router.get(
  '/from/:date',
  authenticateMiddleware(['determineVolunteerModulePermission']),
  paginationMiddleware,
  validateRequest({
    params: z.object({
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in format yyyy-mm-dd')
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { date } = req.params;
      const { volunteerRepository } = getRepositories();
      const dateFormated = moment(date).toDate();
      const { pagination } = req;
      if (!pagination) throw Error();
      const result = await volunteerRepository.getVolunteersFromDate(
        pagination,
        dateFormated
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /volunteers/:email/password
router.patch(
  '/:email/password',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      email: z.string().email()
    }),
    body: z.object({
      password: z.string()
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { email } = req.params;
      const { password } = req.body;
      const { volunteerRepository } = getRepositories();
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

// PATCH /volunteers/:email
router.patch(
  '/:email',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      email: z.string().email()
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { email } = req.params;
      const volunteer = req.body as UpdateVolunteerEntity;
      const turmaHeader = req.headers.turma;
      const { volunteerRepository, emailManager } = getRepositories();
      const updatedVolunteer = await volunteerRepository.updateVolunteer(
        volunteer,
        email,
        !!turmaHeader
      );
      if (!updatedVolunteer)
        throw new ApiError(
          400,
          new VolunteerError({
            name: 'VOLUNTEER_NOT_FOUND',
            message: `Volunteer with email ${email} not found`
          })
        );

      if (turmaHeader) {
        await sendVolunteerCreatedEmail(emailManager, {
          email: updatedVolunteer.email,
          idvol: updatedVolunteer.idvol,
          name: updatedVolunteer.name,
          pep: updatedVolunteer.pep
        });
      }

      res.status(200).json(updatedVolunteer);
    } catch (error) {
      next(error);
    }
  }
);

// GET /volunteers/:email
router.get(
  '/:email',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      email: z.string().email()
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { email } = req.params;
      const { volunteerRepository } = getRepositories();
      const volunteer = await volunteerRepository.getVolunteerByEmail(email);

      if (!volunteer)
        throw new ApiError(
          400,
          new VolunteerError({
            name: 'VOLUNTEER_NOT_FOUND',
            message: `Volunteer with email ${email} not found`
          })
        );

      res.status(200).json(volunteer);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /volunteers/:email
router.delete(
  '/:email',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      email: z.string().email()
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { email } = req.params;
      const { volunteerRepository } = getRepositories();
      const volunteerIsDeleted =
        await volunteerRepository.deleteVolunteerByEmail(email);

      if (!volunteerIsDeleted)
        throw new ApiError(
          400,
          new VolunteerError({
            name: 'VOLUNTEER_NOT_DELETED',
            message: `Volunteer with email ${email} not deleted`
          })
        );
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

// POST /volunteers/hours
router.post(
  '/hours',
  authenticateMiddleware(),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const hoursVolunteer = req.body as PostVolunteerHoursEntity;
      const { volunteerRepository } = getRepositories();
      const currentDate = moment();
      const currentYear = currentDate.year();
      const currentMonth = currentDate.month();
      const eleventhDayOfTheMonth = moment(
        new Date(currentYear, currentMonth, 11)
      );

      if (currentDate.isAfter(eleventhDayOfTheMonth)) {
        throw new ApiError(
          400,
          new VolunteerError({
            name: 'INVALID_DATE_REGISTER',
            message: `Not permitted to register hours after the 11th`
          })
        );
      }

      const existingRegister = await volunteerRepository.findHoursByMonth(
        hoursVolunteer.idVol,
        currentMonth,
        currentYear
      );
      if (existingRegister) {
        throw new ApiError(
          409,
          new VolunteerError({
            name: 'HOURS_ALREADY_REGISTERED',
            message: `Hours already registered this month`
          })
        );
      }
      await volunteerRepository.postVolunteerHours(hoursVolunteer);
      res.status(201).end();
    } catch (error) {
      next(error);
    }
  }
);

// HEAD /volunteers/hours/:idVol
router.head(
  '/hours/:idVol',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      idVol: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { idVol } = req.params;
      const { volunteerRepository } = getRepositories();
      if (!idVol) {
        throw new ApiError(
          404,
          new VolunteerError({
            name: 'VOLUNTEER_NOT_FOUND',
            message: `Volunteer with id ${idVol} not found`
          })
        );
      }

      const currentDate = moment();
      const currentYear = currentDate.year();
      const currentMonth = currentDate.month();
      const existingRegister = await volunteerRepository.findHoursByMonth(
        Number(idVol),
        currentMonth,
        currentYear
      );
      if (!existingRegister) {
        throw new ApiError(
          404,
          new VolunteerError({
            name: 'HOURS_NOT_FOUND',
            message: `Registered volunteer hours with id ${idVol} not found`
          })
        );
      }
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
