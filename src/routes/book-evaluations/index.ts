import { Router } from 'express';
import { SequelizeBookEvaluationRepository } from '@src/services/repositories/sequelize-book-evaluation-repository';
import { BookEvaluationRepository } from '@src/domain/interfaces/repositories/book-evaluation-repository';
import { getContainer } from '../helpers/get-container';
import {
  authenticateMiddleware,
  AuthenticatedRequest
} from '@src/presentation/middlewares/auth-middleware';
import { paginationMiddleware } from '@src/presentation/middlewares/paginationMiddleware';
import { validateRequest } from '@src/presentation/middlewares/validate-request';
import { z } from 'zod';
import xlsx from 'xlsx';
import { Readable } from 'stream';
import { logger } from '@src/services/logger/logger';
import { ApiError } from '@src/presentation/types/api-error';
import { BookEvaluationError } from '@src/domain/errors/book-evaluation';
import { CreateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/create-book-evaluation-entity';
import { UpdateBookEvaluationEntity } from '@src/domain/entities/book-evaluation/update-book-evaluation-entity';

const router = Router();

const getRepositories = () => {
  const container = getContainer();
  const bookEvaluationRepository = container.get<BookEvaluationRepository>(
    SequelizeBookEvaluationRepository
  );
  return { bookEvaluationRepository };
};

// GET /book-evaluations
router.get(
  '/',
  authenticateMiddleware(),
  paginationMiddleware,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { bookEvaluationRepository } = getRepositories();
      const { pagination } = req;
      if (!pagination) throw Error();
      const result = await bookEvaluationRepository.getBookEvaluationList(
        pagination
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /book-evaluations/download
router.get(
  '/download',
  authenticateMiddleware(),
  paginationMiddleware,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { bookEvaluationRepository } = getRepositories();
      const { pagination } = req;
      if (!pagination) throw Error();
      const bookEvaluations =
        await bookEvaluationRepository.getBookEvaluationListDownload(
          pagination
        );

      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(bookEvaluations);
      xlsx.utils.book_append_sheet(wb, ws, `avaliação-do-livro.xlsx`);
      const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + `avaliação-do-livro.xlsx`
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

// POST /book-evaluations
router.post(
  '/',
  authenticateMiddleware(['bookPermission']),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const bookEvaluations = req.body as CreateBookEvaluationEntity[];
      const { bookEvaluationRepository } = getRepositories();
      try {
        await bookEvaluationRepository.createBookEvaluations(bookEvaluations);
        res.status(201).end();
      } catch (error) {
        throw new ApiError(400, error as BookEvaluationError);
      }
    } catch (error) {
      next(error);
    }
  }
);

// PUT /book-evaluations/:evaluationId
router.put(
  '/:evaluationId',
  authenticateMiddleware(['essayModulePermission']),
  validateRequest({
    params: z.object({
      evaluationId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { evaluationId } = req.params;
      const evaluation = req.body as UpdateBookEvaluationEntity;
      const { bookEvaluationRepository } = getRepositories();
      const searchEvaluation =
        await bookEvaluationRepository.getBookEvaluationById(
          Number(evaluationId)
        );
      if (!searchEvaluation) {
        throw new ApiError(
          404,
          new BookEvaluationError({
            name: 'EVALUATION_NOT_FOUND_ERROR',
            message: `Evaluation with id ${evaluationId} not found`
          })
        );
      }

      const updatedEvaluation =
        await bookEvaluationRepository.updatedBookEvaluation(
          Number(evaluationId),
          evaluation
        );

      if (!updatedEvaluation) {
        throw new ApiError(
          400,
          new BookEvaluationError({
            name: 'EVALUATION_NOT_UPDATED_ERROR',
            message: `Evaluation with id ${evaluationId} not upated`
          })
        );
      }

      res.status(200).json(updatedEvaluation);
    } catch (error) {
      next(error);
    }
  }
);

// GET /book-evaluations/:evaluationId
router.get(
  '/:evaluationId',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      evaluationId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { evaluationId } = req.params;
      const { bookEvaluationRepository } = getRepositories();
      const evaluation = await bookEvaluationRepository.getBookEvaluationById(
        Number(evaluationId)
      );

      if (!evaluation) {
        throw new ApiError(
          404,
          new BookEvaluationError({
            name: 'EVALUATION_NOT_FOUND_ERROR',
            message: `Evaluation with id ${evaluationId} not found`
          })
        );
      }

      res.status(200).json(evaluation);
    } catch (error) {
      next(error);
    }
  }
);

// GET /book-evaluations/by-class/:classId
router.get(
  '/by-class/:classId',
  authenticateMiddleware(['bookPermission']),
  validateRequest({
    params: z.object({
      classId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { classId } = req.params;
      const { bookEvaluationRepository } = getRepositories();
      const evaluation =
        await bookEvaluationRepository.getBookEvaluationByClassId(
          Number(classId)
        );

      if (!evaluation) {
        throw new ApiError(
          404,
          new BookEvaluationError({
            name: 'EVALUATION_NOT_FOUND_ERROR',
            message: `Evaluation with id ${classId} not found`
          })
        );
      }

      res.status(200).json(evaluation);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /book-evaluations/:evaluationId
router.delete(
  '/:evaluationId',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      evaluationId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { evaluationId } = req.params;
      const { bookEvaluationRepository } = getRepositories();
      const evaluation = await bookEvaluationRepository.getBookEvaluationById(
        Number(evaluationId)
      );

      if (!evaluation) {
        throw new ApiError(
          404,
          new BookEvaluationError({
            name: 'EVALUATION_NOT_FOUND_ERROR',
            message: `Evaluation with id ${evaluationId} not found`
          })
        );
      }

      await bookEvaluationRepository.deleteBookEvaluation(Number(evaluationId));
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

// GET /book-evaluations/relevant/phrases/:date/download
router.get(
  '/relevant/phrases/:date/download',
  authenticateMiddleware(),
  validateRequest({
    params: z.object({
      date: z.string()
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { date } = req.params;
      const { bookEvaluationRepository } = getRepositories();
      const response = await bookEvaluationRepository.getRelevantPhrases(date);

      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(response);
      xlsx.utils.book_append_sheet(wb, ws, `avaliação-do-livro.xlsx`);
      const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + `avaliação-do-livro-a-partir-de-${date}.xlsx`
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
