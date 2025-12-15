import { Router } from 'express';
import { SequelizePepClassRepository } from '@src/services/repositories/sequelize-pep-class-repository';
import { PepClassRepository } from '@src/domain/interfaces/repositories/pep-class-repository';
import { getContainer } from '../helpers/get-container';
import {
  authenticateMiddleware,
  AuthenticatedRequest
} from '@src/presentation/middlewares/auth-middleware';
import { paginationMiddleware } from '@src/presentation/middlewares/paginationMiddleware';
import { validateRequest } from '@src/presentation/middlewares/validate-request';
import { z } from 'zod';
import { ApiError } from '@src/presentation/types/api-error';
import { PepClassError } from '@src/domain/errors/pep-class';
import { UpdatePepClassEntity } from '@src/domain/entities/pep-class/update-pep-class-entity';

const router = Router();

const getRepositories = () => {
  const container = getContainer();
  const pepClassRepository = container.get<PepClassRepository>(
    SequelizePepClassRepository
  );
  return { pepClassRepository };
};

// GET /pep-class
router.get(
  '/',
  authenticateMiddleware(['notebookModulePermission']),
  paginationMiddleware,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { pepClassRepository } = getRepositories();
      const { pagination } = req;
      if (!pagination) throw Error();
      const result = await pepClassRepository.getAllPepClasses(pagination);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// GET /pep-class/from-id/:classId
router.get(
  '/from-id/:classId',
  authenticateMiddleware(['notebookModulePermission']),
  validateRequest({
    params: z.object({
      classId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { classId } = req.params;
      const { pepClassRepository } = getRepositories();
      const result = await pepClassRepository.getClassesFromId(classId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /pep-class/:classId
router.put(
  '/:classId',
  authenticateMiddleware(['notebookModulePermission']),
  validateRequest({
    params: z.object({
      classId: z.string().transform((val) => parseInt(val, 10))
    })
  }),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { classId } = req.params;
      const pepClass = req.body as UpdatePepClassEntity;
      const { pepClassRepository } = getRepositories();
      const updatedPepClass = await pepClassRepository.updatedClass(
        classId,
        pepClass
      );
      if (!updatedPepClass) {
        throw new ApiError(
          404,
          new PepClassError({
            name: 'PEP_CLASS_NOT_FOUND',
            message: `Class with id ${classId} not found`
          })
        );
      }
      res.status(200).json(updatedPepClass);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
