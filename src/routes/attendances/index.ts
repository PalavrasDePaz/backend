import { Router } from 'express';
import { SequelizeAttendanceRepository } from '@src/services/repositories/sequelize-attendance-repository';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { AttendanceRepository } from '@src/domain/interfaces/repositories/attendance-repository';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import {
  authenticateMiddleware,
  AuthenticatedRequest
} from '@src/presentation/middlewares/auth-middleware';
import { paginationMiddleware } from '@src/presentation/middlewares/paginationMiddleware';
import { validateRequest } from '@src/presentation/middlewares/validate-request';
import { getContainer } from '../helpers/get-container';
import { z } from 'zod';
import moment from 'moment';
import xlsx from 'xlsx';
import { Readable } from 'stream';
import { logger } from '@src/services/logger/logger';
import { ApiError } from '@src/presentation/types/api-error';
import { AttendanceError } from '@src/domain/errors/attendance';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { formatAttendanceAsWorkshopAttendanceRow } from '@src/domain/entity-formatters/format-attendance-row';

const router = Router();

// Helper para obter instâncias dos repositórios
const getRepositories = () => {
  const container = getContainer();
  const attendanceRepository = container.get<AttendanceRepository>(
    SequelizeAttendanceRepository
  );
  const volunteerRepository = container.get<VolunteerRepository>(
    SequelizeVolunteerRepository
  );
  return { attendanceRepository, volunteerRepository };
};

// GET /attendances/download/from/:date
router.get(
  '/download/from/:date',
  authenticateMiddleware(['attendanceModulePermission']),
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
      const { attendanceRepository } = getRepositories();
      const dateFormated = moment(date).toDate();
      const attendances =
        await attendanceRepository.getAttendancesDownloadFromDate(dateFormated);

      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(attendances);
      xlsx.utils.book_append_sheet(wb, ws, `volunteers-${date}.xlsx`);
      const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + `presenca-${date}.xlsx`
      );
      res.setHeader('Content-Type', 'application/octet-stream');
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

// GET /attendances/from/:date
router.get(
  '/from/:date',
  authenticateMiddleware(['attendanceModulePermission']),
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
      const { attendanceRepository } = getRepositories();
      const dateFormated = moment(date).toDate();
      const { pagination } = req;
      if (!pagination) throw Error();
      const result = await attendanceRepository.getAttendancesFromDate(
        pagination,
        dateFormated
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /attendances/metrics/download
router.get(
  '/metrics/download',
  authenticateMiddleware(['manageVolunteerModulePermission']),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { attendanceRepository } = getRepositories();
      const metrics =
        await attendanceRepository.getVolunteersAttendanceDownloadMetrics();

      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(metrics as unknown[]);
      xlsx.utils.book_append_sheet(wb, ws, `presenca-matrics.csv.xlsx`);
      const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + `presenca-matrics.xlsx`
      );
      res.setHeader('Content-Type', 'application/octet-stream');
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

// GET /attendances/metrics
router.get(
  '/metrics',
  authenticateMiddleware(['manageVolunteerModulePermission']),
  paginationMiddleware,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { attendanceRepository } = getRepositories();
      const { pagination } = req;
      if (!pagination) throw Error();
      const metrics = await attendanceRepository.getVolunteersAttendanceMetrics(
        pagination
      );
      res.status(200).json(metrics);
    } catch (error) {
      next(error);
    }
  }
);

// GET /attendances/volunteer/:idvol
router.get(
  '/volunteer/:idvol',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      idvol: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { idvol } = req.params;
      const { attendanceRepository } = getRepositories();
      const attendances = await attendanceRepository.getAllAttendancesByIdVol(
        idvol
      );

      const result = attendances.map((attendance) =>
        formatAttendanceAsWorkshopAttendanceRow(attendance)
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// POST /attendances
router.post(
  '/',
  authenticateMiddleware(),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { attendanceRepository, volunteerRepository } = getRepositories();
      const attendance = req.body;
      const volunteer = await volunteerRepository.getVolunteerById(
        attendance.idvol
      );
      if (!volunteer) {
        throw new ApiError(
          412,
          new VolunteerError({
            name: 'VOLUNTEER_NOT_FOUND',
            message: `Volunteer with id ${attendance.idvol} not found`
          })
        );
      }

      try {
        const submittedAttendance = await attendanceRepository.submitAttendance(
          attendance
        );
        res.status(200).json(submittedAttendance);
      } catch (error) {
        throw new ApiError(400, error as AttendanceError);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
