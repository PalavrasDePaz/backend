import { ErrorBase } from './error-base';

type AttendanceErrorName = 'ATTENDANCES_NOT_FOUND' | 'ATTENDANCE_NOT_SUBMITTED';
export class AttendanceError extends ErrorBase<AttendanceErrorName> {}
