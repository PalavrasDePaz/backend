import { validationExample } from '@src/documentation/validation-example';
import {
  PepClassEntity,
  PepClassWithPlace
} from '@src/domain/entities/pep-class/pep-class-entity';
import { UpdatePepClassEntity } from '@src/domain/entities/pep-class/update-pep-class-entity';
import { PepClassError } from '@src/domain/errors/pep-class';
import { PepClassRepository } from '@src/domain/interfaces/repositories/pep-class-repository';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';
import { SequelizePepClassRepository } from '@src/services/repositories/sequelize-pep-class-repository';
import express from 'express';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import {
  Body,
  Controller,
  FieldErrors,
  Get,
  Middlewares,
  Path,
  Put,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags
} from 'tsoa';
import { paginationMiddleware } from '../middlewares/paginationMiddleware';
import { ApiError } from '../types/api-error';

@Route('pep-class')
@Response<{ message: string; details: FieldErrors }>(
  422,
  'Validation Error',
  validationExample
)
@Tags('Pep Class')
@provide(PepAPI)
export class PepAPI extends Controller {
  private pepClassRepository: PepClassRepository;

  constructor(
    @inject(SequelizePepClassRepository)
    pepClassRepository: PepClassRepository
  ) {
    super();
    this.pepClassRepository = pepClassRepository;
  }

  @Get('/')
  @Security('jwt', ['notebookModulePermission'])
  @Middlewares(paginationMiddleware)
  @SuccessResponse(200, 'Successfully fetched the classes')
  async getClasses(
    @Request() req: express.Request
  ): Promise<PaginationResult<PepClassWithPlace[]>> {
    const { pagination } = req;
    if (!pagination) throw Error();
    return await this.pepClassRepository.getAllPepClasses(pagination);
  }
  /**
   * Get all the pep classes starting from the classId in the path
   *
   *
   * (The volunteer must have notebookModulePermission, which is checked using JWT)
   */
  @Get('from-id/{classId}')
  @Security('jwt', ['notebookModulePermission'])
  @SuccessResponse(200, 'Successfully fetched the classes')
  async getClassesFromId(@Path() classId: number): Promise<PepClassEntity[]> {
    return await this.pepClassRepository.getClassesFromId(classId);
  }

  /**
   * Update class values available at UpdatePepClassEntity from class with classId
   *
   *
   * (The volunteer must have notebookModulePermission, which is checked using JWT)
   */
  @Put('{classId}')
  @Security('jwt', ['notebookModulePermission'])
  @SuccessResponse(200, 'Successfully updated the class')
  @Response<PepClassError>(404, 'Could not find class', {
    name: 'PEP_CLASS_NOT_FOUND',
    message: `Class with id {classId} not found`
  })
  @Response<PepClassError>(400, 'Could not update class', {
    name: 'PEP_ClASS_NOT_UPDATED_ERROR',
    message: `Class with ID {classId} not updated`
  })
  async updateClass(
    @Path() classId: number,
    @Body() pepClass: UpdatePepClassEntity
  ): Promise<PepClassEntity> {
    const updatedPepClass = await this.pepClassRepository.updatedClass(
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
    return updatedPepClass;
  }
}
