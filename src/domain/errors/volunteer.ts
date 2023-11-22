import { ErrorBase } from './error-base';

type ErrorName =
  | 'VOLUNTEER_NOT_FOUND'
  | 'VOLUNTEER_ALREADY_EXISTS'
  | 'VOLUNTEER_NOT_UPDATED'
  | 'VOLUNTEER_UNREGISTERED'
  | 'VOLUNTEER_NOT_DELETED'
  | 'PASSWORD_WRONG_ERROR'
  | 'VOLUNTEER_NOT_DELETED'
  | 'INVALID_DATE_REGISTER'
  | 'HOURS_ALREADY_REGISTERED';

export class VolunteerError extends ErrorBase<ErrorName> {}
