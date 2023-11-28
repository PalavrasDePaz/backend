import { AttendanceEntity } from '@src/domain/entities/attendance/attendance-entity';
import { AttendanceDownloadInfoEntity } from '@src/domain/entities/attendance/attendence-dowload-info-entity';
import { AttendanceInfoEntity } from '@src/domain/entities/attendance/attendence-info-entity';
import { SubmitAttendanceEntity } from '@src/domain/entities/attendance/submit-attendance-entity';
import { PaginationParams } from '@src/presentation/types/paginationParams';
import { PaginationResult } from '@src/services/repositories/helpers/wrapPagination';

export interface AttendanceRepository {
  getAllAttendancesByIdVol(idvol: number): Promise<AttendanceEntity[]>;

  submitAttendance(
    attendance: SubmitAttendanceEntity
  ): Promise<AttendanceEntity>;

  getVolunteersAttendanceDownloadMetrics(): Promise<unknown>;

  getVolunteersAttendanceMetrics(
    pagination: PaginationParams
  ): Promise<PaginationResult<unknown>>;

  getAttendancesDownloadFromDate(
    date: Date
  ): Promise<AttendanceDownloadInfoEntity[]>;

  getAttendancesFromDate(
    pagination: PaginationParams,
    date: Date
  ): Promise<PaginationResult<AttendanceInfoEntity[]>>;
}
