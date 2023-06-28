import { AttendanceEntity } from '@src/domain/entities/attendance-entity';
import { AttendanceRepository } from '@src/domain/interfaces/repositories/attendance-repository';
import { attendanceModelToEntity } from '../database/mappers/attendance';
import { Attendance } from '../database/models/attendance';
import { provideSingleton } from '@src/helpers/provide-singleton';

@provideSingleton(SequelizeAttendanceRepository)
export class SequelizeAttendanceRepository implements AttendanceRepository {
  async getAllAttendancesByIdVol(idvol: number): Promise<AttendanceEntity[]> {
    const attendances = await Attendance.findAll({ where: { idvol } });
    return attendances.map(attendanceModelToEntity);
  }

  /*   async submitAttendance(
    attendance: AttendanceEntity
  ): Promise<AttendanceEntity> {
    const result = await Attendance.create(attendanceModelToEntity(attendance));

    return result;
  } */
}
