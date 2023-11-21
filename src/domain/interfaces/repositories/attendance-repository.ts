import { AttendanceEntity } from '@src/domain/entities/attendance/attendance-entity';
import { AttendanceInfoEntity } from '@src/domain/entities/attendance/attendence-info-entity';
import { SubmitAttendanceEntity } from '@src/domain/entities/attendance/submit-attendance-entity';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';

export interface AttendanceRepository {
  getAllAttendancesByIdVol(idvol: number): Promise<AttendanceEntity[]>;

  submitAttendance(
    attendance: SubmitAttendanceEntity
  ): Promise<AttendanceEntity>;

  getVolunteersAttendanceMetrics(): Promise<unknown>;

  getAttendancesDownloadFromDate(date: Date): Promise<AttendanceInfoEntity[]>;

  getAttendancesFromDate(
    pagination: PaginationParams,
    date: Date
  ): Promise<PaginationResult<AttendanceInfoEntity[]>>;
}
