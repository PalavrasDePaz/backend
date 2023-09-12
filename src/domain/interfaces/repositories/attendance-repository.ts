import { AttendanceEntity } from '@src/domain/entities/attendance-entity';
import { SubmitAttendanceEntity } from '@src/domain/entities/submit-attendance-entity';

export interface AttendanceRepository {
  getAllAttendancesByIdVol(idvol: number): Promise<AttendanceEntity[]>;

  submitAttendance(
    attendance: SubmitAttendanceEntity
  ): Promise<AttendanceEntity>;

  getVolunteersAttendanceMetrics(): Promise<unknown>;
}
