import { validationExample } from '@src/documentation/validation-example';
import AvailableClassRowEntity from '@src/domain/entities/book-club-class/available-class-row-entity';
import { ReserveClassDataEntity } from '@src/domain/entities/book-club-class/reserve-class-data-entity';
import { BookClubClassError } from '@src/domain/errors/book-club-class';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { BookClubClassRepository } from '@src/domain/interfaces/repositories/book-club-class-repository';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { SequelizeBCCRepository } from '@src/services/repositories/sequelize-bcc-repository';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import {
  Controller,
  Get,
  Path,
  Route,
  Response,
  Security,
  SuccessResponse,
  Tags,
  FieldErrors,
  Put,
  Body,
  Request
} from 'tsoa';
import { ApiError } from '../types/api-error';
import { FileHandler } from '@src/services/files/file-handler';
import { DriveFileHandler } from '@src/services/files/drive-file-handler';
import express from 'express';
import path from 'path';
import { createReadStream, mkdirSync, readdirSync, rmSync } from 'fs';
import { STORAGE_DOWNLOAD_FOLDER } from '@src/config/server';
import { Readable } from 'stream';
import { logger } from '@src/services/logger/logger';

@Route('book-club-class')
@Tags('Book Club Class')
@Response<{ message: string; details: FieldErrors }>(
  422,
  'Validation Error',
  validationExample
)
@provide(BookClubClassAPI)
export class BookClubClassAPI extends Controller {
  private bccRepository: BookClubClassRepository;
  private volunteerRepository: VolunteerRepository;
  private fileHandler: FileHandler;

  constructor(
    @inject(SequelizeBCCRepository)
    bccRepository: BookClubClassRepository,
    @inject(SequelizeVolunteerRepository)
    volunteerRepository: VolunteerRepository,
    @inject(DriveFileHandler)
    fileHandler: FileHandler
  ) {
    super();
    this.bccRepository = bccRepository;
    this.volunteerRepository = volunteerRepository;
    this.fileHandler = fileHandler;
  }

  /**
   * Download files of the book club class as a zip
   *
   * (The volunteer must have bookPermission, which is checked using JWT)
   */
  @Get('download/{idclass}')
  @Security('jwt', ['bookPermission'])
  @SuccessResponse(200, 'Successfully downloaded the files')
  @Response<BookClubClassError>(404, 'Essay not found', {
    name: 'ESSAY_NOT_FOUND',
    message: 'Essay with id {some class id} not found'
  })
  public async downloadClassReport(
    @Path() idclass: number,
    @Request() req: express.Request
  ): Promise<Readable> {
    const bcclass = await this.bccRepository.getBookClubClassById(idclass);
    if (!bcclass)
      throw new ApiError(
        404,
        new BookClubClassError({
          name: 'ESSAY_NOT_FOUND',
          message: `Essay with id ${idclass} not found`
        })
      );

    // get target from format https://drive.google.com/drive/folders/{target}?usp=sharing
    const folderId =
      bcclass.folderLink?.split('/').slice(-1)[0].split('?')[0] ?? '';

    const downloadFolder = path.join(
      STORAGE_DOWNLOAD_FOLDER,
      `${req.body.loggedUser.idvol}`
    );
    mkdirSync(downloadFolder, { recursive: true });

    await this.fileHandler.downloadFilesFromSourceToFolder(
      folderId,
      downloadFolder
    );

    await this.fileHandler.zipFiles(downloadFolder, `${idclass}.zip`);

    const zipNameForClient = await this.fileHandler.getFolderName(folderId);

    req.res?.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `${zipNameForClient}.zip`
    );

    req.res?.setHeader('Content-Type', 'application/zip');

    const zipPath = path.join(downloadFolder, `${idclass}.zip`);

    logger.info(`Files on download folder: ${readdirSync(downloadFolder)}`);

    const stream = createReadStream(zipPath);

    stream.on('error', (error) => {
      logger.error(error);
    });

    stream.on('close', () => {
      logger.info('Closing stream');
      rmSync(downloadFolder, { recursive: true });
    });

    return stream;
  }

  /**
   * Get total count of book club classes by a volunteer.
   */
  @Get('count/{idvol}')
  @SuccessResponse(200, 'Ok')
  @Security('jwt')
  public async countEvaluatedBookClubClassByIdVol(
    @Path() idvol: number
  ): Promise<{ count: number }> {
    return this.bccRepository.countEvaluatedClassesByIdVol(idvol);
  }

  /**
   * Get available essays for evaluation for the volunteer,
   * those essays includes the ones which does not have a reservation date
   * or the reservations of the volunteer.
   *
   * (The volunteer must have bookPermission, which is checked using JWT)
   */
  @Get('available/{idvol}')
  @Security('jwt', ['bookPermission'])
  @SuccessResponse(200, 'Successfully fetched the essays')
  async getAvailableClasses(
    @Path() idvol: number
  ): Promise<AvailableClassRowEntity[]> {
    const availableEssays = await this.bccRepository.getAvailableClasses();

    const reservedEssays = await this.bccRepository.getReservedClassesByIdVol(
      idvol
    );

    const volunteerAccessableEssays = [...reservedEssays, ...availableEssays];

    return volunteerAccessableEssays;
  }

  /**
   * Reserve essay for the volunteer. If the essay is already reserved or evaluated
   * status 400 is returned.
   *
   * (The volunteer must have bookPermission, which is checked using JWT)
   */
  @Put('/reservation')
  @Security('jwt', ['bookPermission'])
  @SuccessResponse(200, 'Successfully reserved essay for volunteer')
  @Response<BookClubClassError>(404, 'Essay not found', {
    name: 'ESSAY_NOT_FOUND',
    message: 'Essay with id {some class id} not found'
  })
  @Response<VolunteerError>(412, 'Volunteer not found', {
    name: 'VOLUNTEER_NOT_FOUND',
    message: 'Volunteer with id {some volunteer id} not found'
  })
  @Response<BookClubClassError>(400, 'Essay already reserved or evaluated', {
    name: 'ESSAY_ALREADY_RESERVED_ERROR',
    message: 'Essay already reserved or already evaluated'
  })
  async reserveClassForVolunteer(@Body() reserveData: ReserveClassDataEntity) {
    const { idvol, idclass } = reserveData;

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

    const book = await this.bccRepository.getBookClubClassById(idclass);
    if (!book) {
      throw new ApiError(
        404,
        new BookClubClassError({
          name: 'ESSAY_NOT_FOUND',
          message: `Essay with id ${idclass} not found`
        })
      );
    }

    const reservedEssay = await this.bccRepository.reserveClassForVolunteer(
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

    return reservedEssay;
  }
}
