import { AttendanceEntity } from '@src/domain/entities/attendance-entity';

export interface AttendanceRepository {
  getAllAttendancesByIdVol(idvol: number): Promise<AttendanceEntity[] | null>;

  /*   submitAttendance(
    idvol: number,
    attendance: AttendanceEntity
  ): Promise<AttendanceEntity>; */
}
