import { AttendanceEntity } from '@src/domain/entities/attendance-entity';
import { AttendanceRepository } from '@src/domain/interfaces/repositories/attendance-repository';
import {
  SubmitAttendanceEntityToCreationModel,
  attendanceModelToEntity
} from '../database/mappers/attendance';
import { Attendance } from '../database/models/attendance';
import { provideSingleton } from '@src/helpers/provide-singleton';
import { SubmitAttendanceEntity } from '@src/domain/entities/submit-attendance-entity';
import { AttendanceError } from '@src/domain/errors/attendance';

@provideSingleton(SequelizeAttendanceRepository)
export class SequelizeAttendanceRepository implements AttendanceRepository {
  async getAllAttendancesByIdVol(idvol: number): Promise<AttendanceEntity[]> {
    const attendances = await Attendance.findAll({
      where: { idvol },
      order: [['createdAt', 'ASC']]
    });
    return attendances.map(attendanceModelToEntity);
  }

  async submitAttendance(
    attendance: SubmitAttendanceEntity
  ): Promise<AttendanceEntity> {
    try {
      const createdAttendance = await Attendance.create(
        SubmitAttendanceEntityToCreationModel(attendance)
      );

      return attendanceModelToEntity(createdAttendance);
    } catch (error) {
      throw new AttendanceError({
        name: 'UNSPECIFIED_ERROR',
        message: 'unknow error',
        details: error
      });
    }
  }
}
