import { validationExample } from '@src/documentation/validation-example';
import { PostVolunteerHoursEntity } from '@src/domain/entities/volunteer/post-volunteer-hours-entity';
import { UpdateVolunteerEntity } from '@src/domain/entities/volunteer/update-volunteer-entity';
import { VolunteerAuthDataEntity } from '@src/domain/entities/volunteer/volunteer-auth-entity';
import { VolunteerEntity } from '@src/domain/entities/volunteer/volunteer-entity';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { logger } from '@src/services/logger/logger';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import express from 'express';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { Readable } from 'stream';
import {
  Body,
  Controller,
  Delete,
  FieldErrors,
  Get,
  Head,
  Middlewares,
  Patch,
  Path,
  Post,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags
} from 'tsoa';
import xlsx from 'xlsx';
import { paginationMiddleware } from '../middlewares/paginationMiddleware';
import { ApiError } from '../types/api-error';

@Route('volunteers')
@Response<{ message: string; details: FieldErrors }>(
  422,
  'Validation Error',
  validationExample
)
@Security('jwt')
@provide(VolunteerAPI)
@Tags('Volunteer')
export class VolunteerAPI extends Controller {
  private volunteerRepository: VolunteerRepository;

  constructor(
    @inject(SequelizeVolunteerRepository)
    volunteerRepository: VolunteerRepository
  ) {
    super();
    this.volunteerRepository = volunteerRepository;
  }

  /**
   * Get download all volunteer data from a specified date (the format of the date parameter is: yyyy-mm-dd)
   * OBS: This route returns the data as a stream with attachment headers
   *
   * (The volunteer must have determineVolunteerModulePermission, which is checked using JWT)
   *
   *
   * @example date "2023-09-12"
   */
  @Get('download/from/{date}')
  @Security('jwt', ['determineVolunteerModulePermission'])
  @SuccessResponse(200, 'Successfully got volunteer data')
  public async getDownloadVolunteersFromDate(
    @Path() date: string,
    @Request() req: express.Request
  ): Promise<Readable> {
    const dateFormated = new Date(date);
    const volunteers =
      await this.volunteerRepository.getVolunteersDownloadFromDate(
        dateFormated
      );

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(volunteers);
    xlsx.utils.book_append_sheet(wb, ws, `volunteers-${date}.xlsx`);
    const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    req.res?.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `volunteers.xlsx`
    );
    req.res?.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    req.res?.setHeader('Content-Length', xlsxBuffer.byteLength);

    const stream = Readable.from(xlsxBuffer);

    stream.on('error', (error) => {
      logger.error(error);
    });

    stream.on('close', () => {
      logger.info('Closing stream');
    });

    return stream;
  }

  /**
   * Get all volunteer data from a specified date (the format of the date parameter is: yyyy-mm-dd)
   * Pagination
   *  Sort: ?sort=field1-ASC,field2=DESC&...(obs: field according database column)
   *  Page: ?page=number& (page number)
   *  Limit: ?limit=number& (data quantity - max=30)
   *  Filter: ?field=value& (obs: field according database column)
   *
   * (The volunteer must have determineVolunteerModulePermission, which is checked using JWT)
   *
   *
   * @example date "2023-09-12"
   * @example page "page=3"
   * @example sort "sort=nascimento-DESC"
   * @example limit "limit=20"
   * @example filter "e-mail=user@email.com"
   */
  @Get('from/{date}')
  @Security('jwt', ['determineVolunteerModulePermission'])
  @Middlewares(paginationMiddleware)
  @SuccessResponse(200, 'Successfully got volunteer data')
  public async getVolunteersFromDate(
    @Path() date: string,
    @Request() req: express.Request
  ): Promise<PaginationResult<VolunteerEntity[]>> {
    const dateFormated = moment(new Date(date)).toDate();
    const { pagination } = req;
    if (!pagination) throw Error();
    return await this.volunteerRepository.getVolunteersFromDate(
      pagination,
      dateFormated
    );
  }

  /**
   * Create the volunteer password if it does not exist or udpdate it.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Patch('{email}/password')
  @SuccessResponse(204, 'Password Successfully created or updated')
  @Response<VolunteerError>(400, 'Could not find volunteer')
  async createOrUpdatePassword(
    @Path() email: string,
    @Body() passwordWrapper: Pick<VolunteerAuthDataEntity, 'password'>
  ): Promise<void> {
    const success =
      await this.volunteerRepository.updateOrCreatePasswordForEmail(
        email,
        passwordWrapper.password
      );

    if (!success) {
      throw new ApiError(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message:
            'Could not create or update volunteer password because it was not found'
        })
      );
    }
  }

  /**
   * Update the volunteer.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Patch('{email}')
  @SuccessResponse(200, 'Volunteer successfully updated')
  @Response<VolunteerError>(400, 'Could not update volunteer', {
    name: 'VOLUNTEER_NOT_UPDATED',
    message: 'Volunteer with email {some email} not updated'
  })
  async updateVolunteer(
    @Path() email: string,
    @Body() volunteer: UpdateVolunteerEntity
  ): Promise<VolunteerEntity> {
    const updatedVolunteer = await this.volunteerRepository.updateVolunteer(
      volunteer,
      email
    );
    if (!updatedVolunteer)
      throw new ApiError(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message: `Volunteer with email ${email} not found`
        })
      );

    return updatedVolunteer;
  }

  /**
   * Get the volunteer by email.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Get('{email}')
  @SuccessResponse(200, 'Get volunteer by specified email')
  @Response<VolunteerError>(400, 'Could not find volunteer')
  async getVolunteerByEmail(@Path() email: string): Promise<VolunteerEntity> {
    const volunteer = await this.volunteerRepository.getVolunteerByEmail(email);

    if (!volunteer)
      throw new ApiError(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message: `Volunteer with email ${email} not found`
        })
      );

    return volunteer;
  }

  /**
   * Delete the volunteer.
   *
   * (The logged volunteer can only use the operation on it's own email, unless admin)
   */
  @Delete('{email}')
  @SuccessResponse(204, 'Successfully deleted volunteer')
  @Response<VolunteerError>(400, 'Could not delete volunteer', {
    name: 'VOLUNTEER_NOT_DELETED',
    message: 'Volunteer with email {some email} not deleted'
  })
  async deleteVolunteer(@Path() email: string): Promise<void> {
    const volunteerIsDeleted =
      await this.volunteerRepository.deleteVolunteerByEmail(email);

    if (!volunteerIsDeleted)
      throw new ApiError(
        400,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_DELETED',
          message: `Volunteer with email ${email} not deleted`
        })
      );
  }

  /**
   * Post volunteer hours
   *
   */

  @Post('hours')
  @Security('jwt')
  @SuccessResponse(201, 'Successfully posting hours')
  @Response<VolunteerError>(400, 'Could not delete volunteer', {
    name: 'INVALID_DATE_REGISTER',
    message: 'Not permitted to register hours after the 5th'
  })
  @Response<VolunteerError>(409, 'Could not delete volunteer', {
    name: 'HOURS_ALREADY_REGISTERED',
    message: 'Hours already registered this month'
  })
  public async postVolunteerHours(
    @Body() hoursVolunteer: PostVolunteerHoursEntity
  ): Promise<void> {
    const currentDate = moment(new Date());
    const currentYear = currentDate.year();
    const currentMonth = currentDate.month();
    const eleventhDayOfTheMonth = moment(
      new Date(currentYear, currentMonth, 11)
    );

    if (currentDate.isAfter(eleventhDayOfTheMonth)) {
      throw new ApiError(
        400,
        new VolunteerError({
          name: 'INVALID_DATE_REGISTER',
          message: `Not permitted to register hours after the 11th`
        })
      );
    }

    const existingRegister = await this.volunteerRepository.findHoursByMonth(
      hoursVolunteer.idVol,
      currentMonth,
      currentYear
    );
    if (existingRegister) {
      throw new ApiError(
        409,
        new VolunteerError({
          name: 'HOURS_ALREADY_REGISTERED',
          message: `Hours already registered this month`
        })
      );
    }
    await this.volunteerRepository.postVolunteerHours(hoursVolunteer);
  }

  /**
   * head volunteer hours
   *
   */

  @Head('hours/{idVol}')
  @Security('jwt')
  @SuccessResponse(200, 'Successfully checked volunteer hours status')
  @Response<VolunteerError>(404, 'volunteer not found')
  public async checkVolunteerHoursStatus(@Path() idVol: number): Promise<void> {
    if (!idVol) {
      throw new ApiError(
        404,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message: `Volunteer with id ${idVol} not found`
        })
      );
    }

    const currentDate = moment(new Date());
    const currentYear = currentDate.year();
    const currentMonth = currentDate.month();
    const existingRegister = await this.volunteerRepository.findHoursByMonth(
      idVol,
      currentMonth,
      currentYear
    );
    if (!existingRegister) {
      throw new ApiError(
        404,
        new VolunteerError({
          name: 'HOURS_NOT_FOUND',
          message: `Registered volunteer hours with  id ${idVol} not found`
        })
      );
    }
  }
}
