import { AttendanceEntity } from './attendance-entity';

export type WorkshopAttendanceRowEntity = Pick<
  AttendanceEntity,
  'idAttend' | 'workshopSubject' | 'submissionDate'
>;
