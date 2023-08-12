import { ErrorBase } from './error-base';

type ErrorName = 'ATTENDANCES_NOT_FOUND' | 'ATTENDANCE_NOT_SUBMITTED';
export class AttendanceError extends ErrorBase<ErrorName> {}
