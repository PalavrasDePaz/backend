import { Router } from 'express';
import { SequelizeNotebookRepository } from '@src/services/repositories/sequelize-notebooks-repository';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { DriveFileHandler } from '@src/services/files/drive-file-handler';
import { NotebookRepository } from '@src/domain/interfaces/repositories/notebook-repository';
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
import { Readable } from 'stream';
import { logger } from '@src/services/logger/logger';
import { ApiError } from '@src/presentation/types/api-error';
import { NotebookError } from '@src/domain/errors/notebook';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { FetchFilesError } from '@src/domain/errors/fetch-files';
import { formatAvailableNotebookToTableRow } from '@src/domain/entity-formatters/format-available-notebook';
import { EvaluateNotebookEntity } from '@src/domain/entities/notebook/evaluate-notebook-entity';
import { ReserveNotebookDataEntity } from '@src/domain/entities/notebook/reserve-notebook-data-entity';
import { UpdateNotebookEntity } from '@src/domain/entities/notebook/update-notebook-entity';
import xlsx from 'xlsx';

const router = Router();

const getRepositories = () => {
  const container = getContainer();
  const notebooksRepository = container.get<NotebookRepository>(
    SequelizeNotebookRepository
  );
  const volunteerRepository = container.get<VolunteerRepository>(
    SequelizeVolunteerRepository
  );
  const fileHandler = container.get<FileHandler>(DriveFileHandler);
  return { notebooksRepository, volunteerRepository, fileHandler };
};

// GET /notebooks/evaluation-list
router.get(
  '/evaluation-list',
  authenticateMiddleware(),
  paginationMiddleware,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { notebooksRepository } = getRepositories();
      const { pagination } = req;
      if (!pagination) throw Error();
      const result = await notebooksRepository.getAllNotebookEvaluation(
        pagination
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /notebooks/evaluation-list/download
router.get(
  '/evaluation-list/download',
  authenticateMiddleware(),
  paginationMiddleware,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { notebooksRepository } = getRepositories();
      const { pagination } = req;
      if (!pagination) throw Error();
      const notebooks =
        await notebooksRepository.getAllNotebookEvaluationDownload(pagination);

      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(notebooks);
      xlsx.utils.book_append_sheet(wb, ws, `avaliação-do-caderno.xlsx`);
      const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + `avaliação-do-caderno.xlsx`
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

// GET /notebooks/count/:idvol
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
      const { notebooksRepository } = getRepositories();
      const result = await notebooksRepository.countEvaluatedNotebooksByIdVol(
        idvol
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /notebooks/download/:notebookId
router.get(
  '/download/:notebookId',
  authenticateMiddleware(['readPermission']),
  validateRequest({
    params: z.object({
      notebookId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { notebookId } = req.params;
      const { notebooksRepository, fileHandler } = getRepositories();
      const notebook = await notebooksRepository.getNotebookById(notebookId);
      if (!notebook) {
        throw new ApiError(
          404,
          new NotebookError({
            name: 'NOTEBOOK_NOT_FOUND_ERROR',
            message: `Notebook with id ${notebookId} not found`
          })
        );
      }

      if (!notebook.notebookDirectory) {
        throw new ApiError(
          404,
          new NotebookError({
            name: 'NOTEBOOK_DIRECTORY_NOT_FOUND_ERROR',
            message: 'Could not found notebook directory'
          })
        );
      }

      const folderId = notebook.notebookDirectory
        .split('/')
        .slice(-1)[0]
        .split('?')[0];

      let fileBuffer: Buffer;
      try {
        fileBuffer = await fileHandler.donwloadFileBufferFromName(
          folderId,
          notebook?.studentName ?? ''
        );
      } catch (error) {
        throw new ApiError(404, error as FetchFilesError);
      }

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + `${notebook.studentName}.pdf`
      );
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Length', fileBuffer.byteLength);

      const stream = Readable.from(fileBuffer);

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

// GET /notebooks/available/:idvol
router.get(
  '/available/:idvol',
  authenticateMiddleware(['readPermission']),
  validateRequest({
    params: z.object({
      idvol: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { idvol } = req.params;
      const { notebooksRepository } = getRepositories();
      const availableNotebooks =
        await notebooksRepository.getAvailableNotebooks();
      const reservedNotebooks =
        await notebooksRepository.getReservedNotebooksByIdVol(idvol);
      const volunteerAccessableNotebooks = [
        ...reservedNotebooks,
        ...availableNotebooks
      ];
      const result = volunteerAccessableNotebooks.map((notebook) =>
        formatAvailableNotebookToTableRow(notebook)
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /notebooks/evaluation/:notebookId
router.put(
  '/evaluation/:notebookId',
  authenticateMiddleware(['readPermission']),
  validateRequest({
    params: z.object({
      notebookId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { notebookId } = req.params;
      const notebookData = req.body as EvaluateNotebookEntity;
      const { notebooksRepository } = getRepositories();
      const notebook = await notebooksRepository.getNotebookById(notebookId);
      if (!notebook) {
        throw new ApiError(
          404,
          new NotebookError({
            name: 'NOTEBOOK_NOT_FOUND_ERROR',
            message: `Notebook with id ${notebookId} not found`
          })
        );
      }

      const evaluatedNotebook =
        await notebooksRepository.saveNotebookEvaluation(
          notebookId,
          notebookData
        );

      if (!evaluatedNotebook) {
        throw new ApiError(
          400,
          new NotebookError({
            name: 'NOTEBOOK_ALREADY_EVALUATED_ERROR',
            message: `Notebook with id ${notebookId} already evaulated`
          })
        );
      }

      res.status(200).json(evaluatedNotebook);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /notebooks/reservation
router.put(
  '/reservation',
  authenticateMiddleware(['readPermission']),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const reserveData = req.body as ReserveNotebookDataEntity;
      const { idvol, notebookId } = reserveData;
      const { notebooksRepository, volunteerRepository } = getRepositories();

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

      const notebook = await notebooksRepository.getNotebookById(notebookId);
      if (!notebook) {
        throw new ApiError(
          404,
          new NotebookError({
            name: 'NOTEBOOK_NOT_FOUND_ERROR',
            message: `Notebook with id ${notebookId} not found`
          })
        );
      }

      const reservedNotebook =
        await notebooksRepository.reserveNotebookForVolunteer(
          idvol,
          notebookId
        );

      if (!reservedNotebook) {
        throw new ApiError(
          400,
          new NotebookError({
            name: 'NOTEBOOK_ALREADY_RESERVED_ERROR',
            message: 'Notebook already reserved or already evaluated'
          })
        );
      }

      res.status(200).json(formatAvailableNotebookToTableRow(reservedNotebook));
    } catch (error) {
      next(error);
    }
  }
);

// PUT /notebooks/revert-reservation/:notebookId
router.put(
  '/revert-reservation/:notebookId',
  authenticateMiddleware(['readPermission']),
  validateRequest({
    params: z.object({
      notebookId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { notebookId } = req.params;
      const { notebooksRepository } = getRepositories();
      const notebook = await notebooksRepository.getNotebookById(notebookId);
      if (!notebook) {
        throw new ApiError(
          404,
          new NotebookError({
            name: 'NOTEBOOK_NOT_FOUND_ERROR',
            message: `Notebook with id ${notebookId} not found`
          })
        );
      }

      const revertReservedNotebook =
        await notebooksRepository.revertReserveNotebookForVolunteer(notebookId);

      if (!revertReservedNotebook) {
        throw new ApiError(
          400,
          new NotebookError({
            name: 'NOTEBOOK_ALREADY_RESERVED_ERROR',
            message: 'Notebook already revert reserved or already evaluated'
          })
        );
      }

      res
        .status(200)
        .json(formatAvailableNotebookToTableRow(revertReservedNotebook));
    } catch (error) {
      next(error);
    }
  }
);

// PUT /notebooks/:notebookId
router.put(
  '/:notebookId',
  authenticateMiddleware(['readPermission']),
  validateRequest({
    params: z.object({
      notebookId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { notebookId } = req.params;
      const notebook = req.body as UpdateNotebookEntity;
      const { notebooksRepository } = getRepositories();
      const searchNotebook = await notebooksRepository.getNotebookById(
        notebookId
      );
      if (!searchNotebook) {
        throw new ApiError(
          404,
          new NotebookError({
            name: 'NOTEBOOK_NOT_FOUND_ERROR',
            message: `Notebook with id ${notebookId} not found`
          })
        );
      }

      const updatedNotebook = await notebooksRepository.updatedNotebook(
        notebookId,
        notebook
      );

      if (!updatedNotebook) {
        throw new ApiError(
          400,
          new NotebookError({
            name: 'NOTEBOOK_NOT_UPDATED_ERROR',
            message: `Notebook with ID ${notebookId} not updated`
          })
        );
      }

      res.status(200).json(updatedNotebook);
    } catch (error) {
      next(error);
    }
  }
);

// GET /notebooks/:notebookId
router.get(
  '/:notebookId',
  authenticateMiddleware(['notebookModulePermission']),
  validateRequest({
    params: z.object({
      notebookId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { notebookId } = req.params;
      const { notebooksRepository } = getRepositories();
      const notebook = await notebooksRepository.getNotebookById(notebookId);
      if (!notebook) {
        throw new ApiError(
          404,
          new NotebookError({
            name: 'NOTEBOOK_NOT_FOUND_ERROR',
            message: `Notebook with id ${notebookId} not found`
          })
        );
      }
      res.status(200).json(notebook);
    } catch (error) {
      next(error);
    }
  }
);

// GET /notebooks/reflections/:date/download
router.get(
  '/reflections/:date/download',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      date: z.string()
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { date } = req.params;
      const { notebooksRepository } = getRepositories();
      const response = await notebooksRepository.getReflections(date);
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(response);
      xlsx.utils.book_append_sheet(wb, ws, `avaliação-do-livro.xlsx`);
      const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' +
          `reflexões-de-cadernos-a-partir-de-${date}.xlsx`
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

export default router;
