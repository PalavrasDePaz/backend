import { Router } from 'express';
import { SequelizeBCCRepository } from '@src/services/repositories/sequelize-bcc-repository';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { DriveFileHandler } from '@src/services/files/drive-file-handler';
import { BookClubClassRepository } from '@src/domain/interfaces/repositories/book-club-class-repository';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { FileHandler } from '@src/services/files/file-handler';
import { getContainer } from '../helpers/get-container';
import {
  authenticateMiddleware,
  AuthenticatedRequest
} from '@src/presentation/middlewares/auth-middleware';
import { paginationMiddleware } from '@src/presentation/middlewares/paginationMiddleware';
import { validateRequest } from '@src/presentation/middlewares/validate-request';
import { z } from 'zod';
import { STORAGE_DOWNLOAD_FOLDER } from '@src/config/server';
import { createReadStream, mkdirSync, readdirSync, rmSync, statSync } from 'fs';
import moment from 'moment';
import path from 'path';
import { logger } from '@src/services/logger/logger';
import { ApiError } from '@src/presentation/types/api-error';
import { BookClubClassError } from '@src/domain/errors/book-club-class';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { ReserveClassDataEntity } from '@src/domain/entities/book-club-class/reserve-class-data-entity';
import { UpdateBCClassEntity } from '@src/domain/entities/book-club-class/update-class-entity';

const router = Router();

const getRepositories = () => {
  const container = getContainer();
  const bccRepository = container.get<BookClubClassRepository>(
    SequelizeBCCRepository
  );
  const volunteerRepository = container.get<VolunteerRepository>(
    SequelizeVolunteerRepository
  );
  const fileHandler = container.get<FileHandler>(DriveFileHandler);
  return { bccRepository, volunteerRepository, fileHandler };
};

// GET /book-club-class
router.get(
  '/',
  authenticateMiddleware(),
  paginationMiddleware,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { bccRepository } = getRepositories();
      const { pagination } = req;
      if (!pagination) throw Error();
      const result = await bccRepository.getAllClasses(pagination);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /book-club-class/download/:idclass
router.get(
  '/download/:idclass',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      idclass: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { idclass } = req.params;
      const { bccRepository, fileHandler } = getRepositories();
      const bcclass = await bccRepository.getBookClubClassById(idclass);
      if (!bcclass) {
        throw new ApiError(
          404,
          new BookClubClassError({
            name: 'ESSAY_NOT_FOUND',
            message: `Essay with id ${idclass} not found`
          })
        );
      }

      if (!bcclass.folderLink) {
        throw new ApiError(
          404,
          new BookClubClassError({
            name: 'ESSAYS_DIRECTORY_NOT_FOUND_ERROR',
            message: 'Could not find essays directory'
          })
        );
      }

      const folderId = bcclass.folderLink.split('/').slice(-1)[0].split('?')[0];
      const volunteerId = req.user?.idvol;
      const downloadFolder = path.join(
        STORAGE_DOWNLOAD_FOLDER,
        `${volunteerId}`
      );
      mkdirSync(downloadFolder, { recursive: true });

      await fileHandler.downloadFilesFromSourceToFolder(
        folderId,
        downloadFolder
      );

      await fileHandler.zipFiles(downloadFolder, `${idclass}.zip`);
      const zipNameForClient = await fileHandler.getFolderName(folderId);
      const zipPath = path.join(downloadFolder, `${idclass}.zip`);

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + `${zipNameForClient}.zip`
      );
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Length', statSync(zipPath).size);

      logger.info(`Files on download folder: ${readdirSync(downloadFolder)}`);

      const stream = createReadStream(zipPath);

      stream.on('error', (error) => {
        logger.error(error);
      });

      stream.on('close', () => {
        logger.info('Closing stream');
        rmSync(downloadFolder, { recursive: true });
      });

      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }
);

// GET /book-club-class/count/:idvol
router.get(
  '/count/:idvol',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      idvol: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { idvol } = req.params;
      const { bccRepository } = getRepositories();
      const result = await bccRepository.countEvaluatedClassesByIdVol(idvol);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /book-club-class/available/:idvol
router.get(
  '/available/:idvol',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      idvol: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { idvol } = req.params;
      const { bccRepository } = getRepositories();
      const availableEssays = await bccRepository.getAvailableClasses();
      const hasDataInvioFunap = false;
      const reservedEssays = await bccRepository.getReservedClassesByIdVol(
        idvol,
        hasDataInvioFunap
      );
      const volunteerAccessableEssays = [...reservedEssays, ...availableEssays];
      res.status(200).json(volunteerAccessableEssays);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /book-club-class/reservation
router.put(
  '/reservation',
  authenticateMiddleware(['bookPermission']),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const reserveData = req.body as ReserveClassDataEntity;
      const { idvol, idclass } = reserveData;
      const { bccRepository, volunteerRepository } = getRepositories();

      const volunteer = await volunteerRepository.getVolunteerById(idvol);
      if (!volunteer) {
        throw new ApiError(
          412,
          new VolunteerError({
            name: 'VOLUNTEER_NOT_FOUND',
            message: `Volunteer with id ${idvol} not found`
          })
        );
      }

      const book = await bccRepository.getBookClubClassById(idclass);
      if (!book) {
        throw new ApiError(
          404,
          new BookClubClassError({
            name: 'ESSAY_NOT_FOUND',
            message: `Essay with id ${idclass} not found`
          })
        );
      }

      const reservedEssay = await bccRepository.reserveClassForVolunteer(
        idvol,
        idclass
      );

      if (!reservedEssay) {
        throw new ApiError(
          400,
          new BookClubClassError({
            name: 'ESSAY_ALREADY_RESERVED_ERROR',
            message: 'Essay already reserved or already evaluated'
          })
        );
      }

      res.status(200).json(reservedEssay);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /book-club-class/revert-reservation/:classId
router.put(
  '/revert-reservation/:classId',
  authenticateMiddleware(['bookPermission']),
  validateRequest({
    params: z.object({
      classId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { classId } = req.params;
      const { bccRepository } = getRepositories();
      const book = await bccRepository.getBookClubClassById(classId);
      if (!book) {
        throw new ApiError(
          404,
          new BookClubClassError({
            name: 'ESSAY_NOT_FOUND',
            message: `Essay with id ${classId} not found`
          })
        );
      }

      const revertReservedEssay =
        await bccRepository.revertReserveClassForVolunteer(classId);

      if (!revertReservedEssay) {
        throw new ApiError(
          400,
          new BookClubClassError({
            name: 'ESSAY_ALREADY_RESERVED_ERROR',
            message: 'Essay already revert reserved or already evaluated'
          })
        );
      }

      res.status(200).json(revertReservedEssay);
    } catch (error) {
      next(error);
    }
  }
);

// GET /book-club-class/from-id/:classId
router.get(
  '/from-id/:classId',
  authenticateMiddleware(['essayModulePermission']),
  validateRequest({
    params: z.object({
      classId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { classId } = req.params;
      const { bccRepository } = getRepositories();
      const result = await bccRepository.getClassesFromId(classId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /book-club-class/:classId
router.put(
  '/:classId',
  authenticateMiddleware(['essayModulePermission']),
  validateRequest({
    params: z.object({
      classId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { classId } = req.params;
      const bookClubClass = req.body as UpdateBCClassEntity;
      const { bccRepository } = getRepositories();
      const book = await bccRepository.getBookClubClassById(classId);
      if (!book) {
        throw new ApiError(
          404,
          new BookClubClassError({
            name: 'ESSAY_NOT_FOUND',
            message: `Essay with id ${classId} not found`
          })
        );
      }

      const updatedBCC = await bccRepository.updatedClass(
        classId,
        bookClubClass
      );

      if (!updatedBCC) {
        throw new ApiError(
          400,
          new BookClubClassError({
            name: 'ClASS_NOT_UPDATED_ERROR',
            message: `Class with ID ${classId} not updated`
          })
        );
      }

      res.status(200).json(updatedBCC);
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /book-club-class/:classId
router.patch(
  '/:classId',
  authenticateMiddleware(['bookPermission']),
  validateRequest({
    params: z.object({
      classId: z.string().transform((val) => parseInt(val, 10))
    }),
    body: z.object({
      endEvaluationDate: z
        .union([
          z.date(),
          z.string().transform((val) => new Date(val)),
          z.null()
        ])
        .optional()
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { classId } = req.params;
      const evaluationDate = req.body as { endEvaluationDate: Date | null };
      const { bccRepository } = getRepositories();
      const book = await bccRepository.getBookClubClassById(classId);
      let evaluationDateFormatted = evaluationDate?.endEvaluationDate ?? null;
      if (evaluationDate?.endEvaluationDate) {
        evaluationDateFormatted = moment(
          evaluationDate.endEvaluationDate
        ).toDate();
        if (!book) {
          throw new ApiError(
            404,
            new BookClubClassError({
              name: 'ESSAY_NOT_FOUND',
              message: `Essay with id ${classId} not found`
            })
          );
        }
      }

      const updatedField = await bccRepository.updateConcluded(
        classId,
        evaluationDateFormatted
      );

      if (!updatedField) {
        throw new ApiError(
          400,
          new BookClubClassError({
            name: 'ClASS_NOT_UPDATED_ERROR',
            message: `Class with ID ${classId} not updated`
          })
        );
      }

      res.status(200).json(updatedField);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
