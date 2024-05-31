import { AttendanceEntity } from '@src/domain/entities/attendance/attendance-entity';
import { AttendanceInfoEntity } from '@src/domain/entities/attendance/attendence-info-entity';
import { SubmitAttendanceEntity } from '@src/domain/entities/attendance/submit-attendance-entity';
import { WorkshopAttendanceRowEntity } from '@src/domain/entities/attendance/workshop-attendance-row-entity';
import { formatAttendanceAsWorkshopAttendanceRow } from '@src/domain/entity-formatters/format-attendance-row';
import { AttendanceError } from '@src/domain/errors/attendance';
import { VolunteerError } from '@src/domain/errors/volunteer';
import { AttendanceRepository } from '@src/domain/interfaces/repositories/attendance-repository';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { logger } from '@src/services/logger/logger';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';
import { SequelizeAttendanceRepository } from '@src/services/repositories/sequelize-attendance-repository';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import express from 'express';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { Readable } from 'stream';
import {
  Body,
  Controller,
  Example,
  Get,
  Middlewares,
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

@Route('attendances')
@Tags('Attendance')
@Security('jwt')
@provide(AttendanceAPI)
export class AttendanceAPI extends Controller {
  private attendanceRepository: AttendanceRepository;
  private volunteerRepository: VolunteerRepository;

  constructor(
    @inject(SequelizeAttendanceRepository)
    attendanceRepository: AttendanceRepository,
    @inject(SequelizeVolunteerRepository)
    volunteerRepository: VolunteerRepository
  ) {
    super();
    this.attendanceRepository = attendanceRepository;
    this.volunteerRepository = volunteerRepository;
  }

  /**
   * Get download all attendances from a specified date (the format of the date parameter is: yyyy-mm-dd)
   * OBS: This route returns the data as a stream with attachment headers
   *
   * (The volunteer must have attendanceModulePermission, which is checked using JWT)
   *
   * @example date "2023-09-12"
   */
  @Get('download/from/{date}')
  @Security('jwt', ['attendanceModulePermission'])
  @SuccessResponse(200, 'Successfully got attendances')
  public async getAttendancesDownloadFromDate(
    @Path() date: string,
    @Request() req: express.Request
  ): Promise<Readable> {
    const dateFormated = moment(date).toDate();
    const attendances =
      await this.attendanceRepository.getAttendancesDownloadFromDate(
        dateFormated
      );

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(attendances);
    xlsx.utils.book_append_sheet(wb, ws, `volunteers-${date}.xlsx`);
    const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    req.res?.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `presenca-${date}.xlsx`
    );
    req.res?.setHeader('Content-Type', 'application/octet-stream');
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
   * Get all attendances from a specified date (the format of the date parameter is: yyyy-mm-dd)
   *
   * (The volunteer must have attendanceModulePermission, which is checked using JWT)
   *
   *  * Pagination
   *  Sort: ?sort=field1-ASC,field2=DESC&...(obs: field according database column)
   *  Page: ?page=number& (page number)
   *  Limit: ?limit=number& (data quantity - max=30)
   *  Filter: ?field=value& (obs: field according database column)
   *
   *
   * @example date "2023-09-12"
   *  @example page "page=3"
   * @example sort "sort=nascimento-DESC"
   * @example limit "limit=20"
   * @example filter "e-mail=user@email.com"
   */
  @Get('from/{date}')
  @Security('jwt', ['attendanceModulePermission'])
  @Middlewares(paginationMiddleware)
  @SuccessResponse(200, 'Successfully got attendances')
  public async getAttendancesFromDate(
    @Path() date: string,
    @Request() req: express.Request
  ): Promise<PaginationResult<AttendanceInfoEntity[]>> {
    const dateFormated = moment(date).toDate();
    const { pagination } = req;
    if (!pagination) throw Error();
    return await this.attendanceRepository.getAttendancesFromDate(
      pagination,
      dateFormated
    );
  }

  /**
   * Get download volunteer attendance metrics such as course attendances, number of evaluations and others.
   * The objects returned in this route has field names in portuguese as the use of the route is only to
   * convert those objects to a view such as a table for the volunteers of the project
   *
   * (The volunteer must have manageVolunteerModulePermission, which is checked using JWT)
   */
  @Get('metrics/download/')
  @Security('jwt', ['manageVolunteerModulePermission'])
  @SuccessResponse(200, 'Successfully generated the metrics')
  @Example({ metrics: [{ field1: 'something1' }, { field1: 'something2' }] })
  public async getDownloadVolunteersAttendanceMetrics(
    @Request() req: express.Request
  ): Promise<Readable> {
    const metrics =
      await this.attendanceRepository.getVolunteersAttendanceDownloadMetrics();

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(metrics as unknown[]);
    xlsx.utils.book_append_sheet(wb, ws, `presenca-matrics.csv.xlsx`);
    const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    req.res?.setHeader(
      'Content-Disposition',
      'attachment; filename=' + `presenca-matrics.xlsx`
    );
    req.res?.setHeader('Content-Type', 'application/octet-stream');
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
   * Get volunteer attendance metrics such as course attendances, number of evaluations and others.
   * The objects returned in this route has field names in portuguese as the use of the route is only to
   * convert those objects to a view such as a table for the volunteers of the project
   *
   * (The volunteer must have manageVolunteerModulePermission, which is checked using JWT)
   *  Pagination
   *  Page: ?page=number& (page number)
   *  Limit: ?limit=number& (data quantity - max=30)
   *
   * @example page "page=3"
   * @example limit "limit=20"
   */

  @Get('metrics/')
  @Security('jwt', ['manageVolunteerModulePermission'])
  @Middlewares(paginationMiddleware)
  @SuccessResponse(200, 'Successfully generated the metrics')
  @Example({ metrics: [{ field1: 'something1' }, { field1: 'something2' }] })
  public async getVolunteersAttendanceMetrics(
    @Request() req: express.Request
  ): Promise<PaginationResult<unknown>> {
    const { pagination } = req;
    if (!pagination) throw Error();
    const metrics =
      await this.attendanceRepository.getVolunteersAttendanceMetrics(
        pagination
      );
    return metrics;
  }

  /**
   * Get all the workshop attendances that the volunteer with idvol attended
   */
  @Get('volunteer/{idvol}')
  @SuccessResponse(200, 'Successfully got attendances')
  public async getAttencesByIdVol(
    @Path() idvol: number
  ): Promise<WorkshopAttendanceRowEntity[]> {
    const attendances =
      await this.attendanceRepository.getAllAttendancesByIdVol(idvol);

    return attendances.map((attendance) =>
      formatAttendanceAsWorkshopAttendanceRow(attendance)
    );
  }

  /**
   * Submit attendance for the volunteer specified body
   */
  @Post()
  @SuccessResponse(200, 'Successfully created attendance')
  @Response<VolunteerError>(412, 'Volunteer not found', {
    name: 'VOLUNTEER_NOT_FOUND',
    message: 'Volunteer with id {some idvol} not found'
  })
  @Response<AttendanceError>(400, 'Attendance error', {
    name: 'UNSPECIFIED_ERROR',
    message: 'Unknown error',
    details: 'Error details'
  })
  public async submitAttendance(
    @Body() attendance: SubmitAttendanceEntity
  ): Promise<AttendanceEntity> {
    const volunteer = await this.volunteerRepository.getVolunteerById(
      attendance.idvol
    );
    if (!volunteer) {
      throw new ApiError(
        412,
        new VolunteerError({
          name: 'VOLUNTEER_NOT_FOUND',
          message: `Volunteer with id ${attendance.idvol} not found`
        })
      );
    }

    try {
      const submittedAttendance =
        await this.attendanceRepository.submitAttendance(attendance);
      return submittedAttendance;
    } catch (error) {
      throw new ApiError(400, error as AttendanceError);
    }
  }
}
