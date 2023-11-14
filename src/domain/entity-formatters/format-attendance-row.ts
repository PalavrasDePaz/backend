import { AttendanceEntity } from '@src/domain/entities/attendance/attendance-entity';
import { WorkshopAttendanceRowEntity } from '@src/domain/entities/attendance/workshop-attendance-row-entity';

export const formatAttendanceAsWorkshopAttendanceRow = (
  attendance: AttendanceEntity
): WorkshopAttendanceRowEntity => {
  return {
    idAttend: attendance.idAttend,
    workshopSubject: attendance.workshopSubject,
    submissionDate: attendance.submissionDate
  };
};
