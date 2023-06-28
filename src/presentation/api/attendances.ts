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
  SuccessResponse,
  Tags
} from 'tsoa';
import { ApiError } from '../types/api-error';
import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { AttendanceError } from '@src/domain/errors/attendance';
import { SequelizeAttendanceRepository } from '@src/services/repositories/sequelize-attendance-repository';
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

  @Get('{idvol}')
  @SuccessResponse(200, 'OK')
  public async getAttencesByIdVol(
    @Path() idvol: number
  ): Promise<{ attendances: AttendanceEntity[] }> {
    const attendances =
      await this.attendanceRepository.getAllAttendancesByIdVol(idvol);
    if (!attendances) {
      throw new ApiError(
        400,
        new AttendanceError({
          name: 'ATTENDANCES_NOT_FOUND',
          message: 'No attendance found'
        })
      );
    }

    return { attendances };
  }

  /*  @Post('{idvol}')
  @SuccessResponse(200, 'Ok')
  public async submitAttendance(
    @Path() idvol: number,
    @Body() attendance: AttendanceEntity
  ): Promise<AttendanceEntity> {
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

    const submittedAttendance =
      await this.attendanceRepository.submitAttendance(idvol, attendance);

    if (!submittedAttendance) {
      throw new ApiError(
        400,
        new AttendanceError({
          name: 'ATTENDANCE_NOT_SUBMITTED',
          message: 'Attendance not submitted'
        })
      );
    }
    return submittedAttendance;
  } */
}
