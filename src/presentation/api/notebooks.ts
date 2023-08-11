import { AvailableNotebookRowEntity } from '@src/domain/entities/notebook/available-notebook-row-entity';
import { ReserveNotebookDataEntity } from '@src/domain/entities/notebook/reserve-notebook-data-entity';
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
  Body,
  Put,
  Request
} from 'tsoa';
import { ApiError } from '../types/api-error';
import { NotebookError } from '@src/domain/errors/notebook';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { validationExample } from '@src/documentation/validation-example';
import { EvaluateNotebookEntity } from '@src/domain/entities/notebook/evaluate-notebook-entity';
import { Readable } from 'stream';
import express from 'express';
import { FileHandler } from '@src/services/files/file-handler';
import { DriveFileHandler } from '@src/services/files/drive-file-handler';
import { logger } from '@src/services/logger/logger';
import { FetchFilesError } from '@src/domain/errors/fetch-files';

@Route('notebooks')
@Response<{ message: string; details: FieldErrors }>(
  422,
  'Validation Error',
  validationExample
)
@Tags('Notebook')
@provide(NotebookAPI)
export class NotebookAPI extends Controller {
  private notebooksRepository: NotebookRepository;
  private volunteerRepository: VolunteerRepository;
  private fileHandler: FileHandler;

  constructor(
    @inject(SequelizeNotebookRepository)
    notebooksRepository: NotebookRepository,
    @inject(SequelizeVolunteerRepository)
    volunteerRepository: VolunteerRepository,
    @inject(DriveFileHandler)
    fileHandler: FileHandler
  ) {
    super();
    this.notebooksRepository = notebooksRepository;
    this.volunteerRepository = volunteerRepository;
    this.fileHandler = fileHandler;
  }

  /**
   * Get total count of notebooks by a volunteer.
   */
  @Get('count/{idvol}')
  @SuccessResponse(200, 'Ok')
  @Security('jwt')
  public async countEvaluatedNotebooksByIdVol(
    @Path() idvol: number
  ): Promise<{ count: number }> {
    return this.notebooksRepository.countEvaluatedNotebooksByIdVol(idvol);
  }

  /**
   * Download the notebook with specified id
   *
   * (The volunteer must have readPermission, which is checked using JWT)
   */
  @Get('download/{notebookId}')
  @Security('jwt', ['readPermission'])
  @SuccessResponse(200, 'Successfully downloaded the files')
  @Response<NotebookError>(404, 'Essay not found', {
    name: 'NOTEBOOK_NOT_FOUND',
    message: 'Notebook with id {some Id} not found'
  })
  public async downloadNotebookFromId(
    @Path() notebookId: number,
    @Request() req: express.Request
  ): Promise<Readable> {
    const notebook = await this.notebooksRepository.getNotebookById(notebookId);
    if (!notebook)
      throw new ApiError(
        404,
        new NotebookError({
          name: 'NOTEBOOK_NOT_FOUND',
          message: `Notebook with id ${notebookId} not found`
        })
      );

    if (!notebook.notebookDirectory)
      throw new ApiError(
        404,
        new NotebookError({
          name: 'NOTEBOOK_DIRECTORY_NOT_FOUND_ERROR',
          message: 'Could not found notebook directory'
        })
      );

    // get target from format https://drive.google.com/drive/folders/{target}?usp=sharing
    const folderId = notebook.notebookDirectory
      .split('/')
      .slice(-1)[0]
      .split('?')[0];

    let fileBuffer: Buffer;
    try {
      fileBuffer = await this.fileHandler.donwloadFileBufferFromName(
        folderId,
        notebook.studentName
      );
    } catch (error) {
      throw new ApiError(404, error as FetchFilesError);
    }

    req.res?.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `${notebook.studentName}.pdf`
    );
    req.res?.setHeader('Content-Type', 'application/octet-stream');
    req.res?.setHeader('Content-Length', fileBuffer.byteLength);

    const stream = Readable.from(fileBuffer);

    stream.on('error', (error) => {
      logger.error(error);
    });

    stream.on('close', () => {
      logger.info('Closing stream');
    });

    return stream;
  }

  /**
   * Get available notebooks for evaluation for the volunteer,
   * those notebooks includes the ones which does not have a reservation date
   * or the reservations of the volunteer.
   *
   * (The volunteer must have readPermission, which is checked using JWT)
   */
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

  /**
   * Evaluate a notebook
   *
   * (The volunteer must have readPermission, which is checked using JWT)
   */
  @Put('/evaluation/{notebookId}')
  @Security('jwt', ['readPermission'])
  @SuccessResponse(200, 'Successfully Evaluated notebook')
  @Response<NotebookError>(404, 'Notebook not found', {
    name: 'NOTEBOOK_NOT_FOUND',
    message: 'Notebook with id {some notebook id} not found'
  })
  @Response<NotebookError>(400, 'Notebook already evaluated', {
    name: 'NOTEBOOK_ALREADY_RESERVED_ERROR',
    message: 'Notebook with id {some notebook id} not found'
  })
  async saveNotebookEvaluation(
    @Path() notebookId: number,
    @Body() notebookData: EvaluateNotebookEntity
  ) {
    const notebook = await this.notebooksRepository.getNotebookById(notebookId);
    if (!notebook) {
      throw new ApiError(
        404,
        new NotebookError({
          name: 'NOTEBOOK_NOT_FOUND',
          message: `Notebook with id ${notebookId} not found`
        })
      );
    }

    const evaluatedNotebook =
      await this.notebooksRepository.saveNotebookEvaluation(
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

    return evaluatedNotebook;
  }

  /**
   * Reserve notebook for the volunteer. If the notebook is already reserve or evaluated
   * status 400 is returned.
   *
   * (The volunteer must have readPermission, which is checked using JWT)
   */
  @Post('/reservation')
  @Security('jwt', ['readPermission'])
  @SuccessResponse(200, 'Successfully reserved notebook for volunteer')
  @Response<NotebookError>(404, 'Notebook not found', {
    name: 'NOTEBOOK_NOT_FOUND',
    message: 'Notebook with id {some notebook id} not found'
  })
  @Response<VolunteerError>(412, 'Volunteer not found', {
    name: 'VOLUNTEER_NOT_FOUND',
    message: 'Volunteer with id {some volunteer id} not found'
  })
  @Response<NotebookError>(400, 'Notebook already reserved or evaluated', {
    name: 'NOTEBOOK_ALREADY_RESERVED_ERROR',
    message: 'Notebook already reserved or already evaluated'
  })
  async reserveNotebookForVolunteer(
    @Body() reserveData: ReserveNotebookDataEntity
  ) {
    const { idvol, notebookId } = reserveData;

    const volunteer = await this.volunteerRepository.getVolunteerById(idvol);
    if (!volunteer) {
      throw new ApiError(
        412,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message: `Volunteer with id ${idvol} not found`
        })
      );
    }

    const notebook = await this.notebooksRepository.getNotebookById(notebookId);
    if (!notebook) {
      throw new ApiError(
        404,
        new NotebookError({
          name: 'NOTEBOOK_NOT_FOUND',
          message: `Notebook with id ${notebookId} not found`
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
          message: 'Notebook already reserved or already evaluated'
        })
      );
    }

    return formatAvailableNotebookToTableRow(reservedNotebook);
  }
}
