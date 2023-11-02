import { AttendanceEntity } from './attendance-entity';

export type SubmitAttendanceEntity = Omit<
  AttendanceEntity,
  'idAttend' | 'submissionDate'
>;
