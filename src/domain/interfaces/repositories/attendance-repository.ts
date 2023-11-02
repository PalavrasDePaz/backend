import { AttendanceEntity } from '@src/domain/entities/attendance/attendance-entity';
import { AttendanceInfoEntity } from '@src/domain/entities/attendance/attendence-info-entity';
import { SubmitAttendanceEntity } from '@src/domain/entities/attendance/submit-attendance-entity';

export interface AttendanceRepository {
  getAllAttendancesByIdVol(idvol: number): Promise<AttendanceEntity[]>;

  submitAttendance(
    attendance: SubmitAttendanceEntity
  ): Promise<AttendanceEntity>;

  getVolunteersAttendanceMetrics(): Promise<unknown>;

  getAttendancesFromDate(date: Date): Promise<AttendanceInfoEntity[]>;
}
