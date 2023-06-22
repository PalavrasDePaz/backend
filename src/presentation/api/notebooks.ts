import { AvailableNotebookRowEntity } from '@src/domain/entities/available-notebook-row-entity';
import { ReserveNotebookDataEntity } from '@src/domain/entities/reserve-notebook-data-entity';
import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';
import { NotebookRepository } from '@src/domain/interfaces/repositories/notebook-repository';
import { formatAvailableNotebookToTableRow } from '@src/helpers/format-available-notebook';
import { SequelizeNotebookRepository } from '@src/services/repositories/sequelize-notebooks-repository';
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
  Post,
  Body
} from 'tsoa';
import { ApiError } from '../types/api-error';
import { NotebookError } from '@src/domain/errors/notebook';

@Route('notebooks')
@Response<{ message: string; details: FieldErrors }>(422, 'Validation Error')
@Tags('Notebook')
@provide(NotebookAPI)
export class NotebookAPI extends Controller {
  private notebooksRepository: NotebookRepository;

  constructor(
    @inject(SequelizeNotebookRepository)
    notebooksRepository: NotebookRepository
  ) {
    super();
    this.notebooksRepository = notebooksRepository;
  }

  /**
   * Get all notebooks by a volunteer and total count.
   */
  @Get('count/{idvol}')
  @Security('jwt')
  async getNotebooksByIdVol(@Path() idvol: number): Promise<{ count: number }> {
    const notebooks = await this.notebooksRepository.getNotebooksByIdVol(idvol);
    return { count: notebooks.length };
  }

  @Get('available/{idvol}')
  @Security('jwt', ['readPermission'])
  @SuccessResponse(200, 'Successfully fetched the notebooks')
  async getAvailableNotebooksForEvalForIdVol(
    @Path() idvol: number
  ): Promise<AvailableNotebookRowEntity[]> {
    const availableNotebooks =
      await this.notebooksRepository.getAvailableNotebooks();

    const reservedNotebooks =
      await this.notebooksRepository.getReservedNotebooksByIdVol(idvol);

    const volunteerAccessableNotebooks = [
      ...reservedNotebooks,
      ...availableNotebooks
    ];
    return volunteerAccessableNotebooks.map((notebook) =>
      formatAvailableNotebookToTableRow(notebook)
    );
  }

  @Post('/reserved')
  @Security('jwt', ['readPermission'])
  @SuccessResponse(200, 'Successfully reserved notebook for volunteer')
  @Response<NotebookError>(404, 'Notebook not found', {
    name: 'NOTEBOOK_NOT_FOUND',
    message: 'Notebook not found'
  })
  @Response<NotebookError>(400, 'Notebook already reserved', {
    name: 'NOTEBOOK_ALREADY_RESERVED_ERROR',
    message: 'Notebook already reserved'
  })
  async reserveNotebookForVolunteer(
    @Body() reserveData: ReserveNotebookDataEntity
  ) {
    const { idvol, notebookId } = reserveData;

    const notebook = await this.notebooksRepository.getNotebookById(notebookId);
    if (!notebook) {
      throw new ApiError(
        404,
        new NotebookError({
          name: 'NOTEBOOK_NOT_FOUND',
          message: 'Notebook not found'
        })
      );
    }

    const reservedNotebook =
      await this.notebooksRepository.reserveNotebookForVolunteer(
        idvol,
        notebookId
      );

    if (!reservedNotebook) {
      throw new ApiError(
        400,
        new NotebookError({
          name: 'NOTEBOOK_ALREADY_RESERVED_ERROR',
          message: 'Notebook already reserved'
        })
      );
    }

    return formatAvailableNotebookToTableRow(reservedNotebook);
  }
}
