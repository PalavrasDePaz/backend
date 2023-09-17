import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import {
  Controller,
  FieldErrors,
  Get,
  Path,
  Route,
  Security,
  SuccessResponse,
  Response,
  Tags,
  Body,
  Put
} from 'tsoa';
import { ApiError } from '../types/api-error';
import { validationExample } from '@src/documentation/validation-example';
import { PepClassEntity } from '@src/domain/entities/pep-class/pep-class-entity';
import { PepClassRepository } from '@src/domain/interfaces/repositories/pep-class-repository';
import { SequelizePepClassRepository } from '@src/services/repositories/sequelize-pep-class-repository';
import { PepClassError } from '@src/domain/errors/pep-class';
import { UpdatePepClassEntity } from '@src/domain/entities/pep-class/update-pep-class-entity';

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
    const searchPepClass = await this.pepClassRepository.getPepClassById(
      classId
    );
    if (!searchPepClass) {
      throw new ApiError(
        404,
        new PepClassError({
          name: 'PEP_CLASS_NOT_FOUND',
          message: `Class with id ${classId} not found`
        })
      );
    }

    const updatedPepClass = await this.pepClassRepository.updatedClass(
      classId,
      pepClass
    );

    if (!updatedPepClass) {
      throw new ApiError(
        400,
        new PepClassError({
          name: 'PEP_ClASS_NOT_UPDATED_ERROR',
          message: `Class with ID ${classId} not updated`
        })
      );
    }

    return updatedPepClass;
  }
}
