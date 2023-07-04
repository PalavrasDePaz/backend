import { AttendanceEntity } from '@src/domain/entities/attendance-entity';
import { AttendanceRepository } from '@src/domain/interfaces/repositories/attendance-repository';
import { VolunteerRepository } from '@src/domain/interfaces/repositories/volunteer-repository';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  Security,
  Response,
  SuccessResponse,
  Tags
} from 'tsoa';
import { ApiError } from '../types/api-error';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { AttendanceError } from '@src/domain/errors/attendance';
import { SequelizeAttendanceRepository } from '@src/services/repositories/sequelize-attendance-repository';
import { formatAttendanceAsWorkshopAttendanceRow } from '@src/helpers/format-attendance-row';
import { WorkshopAttendanceRowEntity } from '@src/domain/entities/workshop-attendance-row-entity';
import { SubmitAttendanceEntity } from '@src/domain/entities/submit-attendance-entity';
import { VolunteerError } from '@src/domain/errors/volunteer';

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
   * Get all the workshop attendances that the volunteer with idvol attended
   */
  @Get('{idvol}')
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
