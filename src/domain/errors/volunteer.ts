import { ErrorBase } from './error-base';

type ErrorName =
  | 'VOLUNTEER_NOT_FOUND'
  | 'VOLUNTEER_ALREADY_EXISTS'
  | 'VOLUNTEER_NOT_UPDATED'
  | 'EMAIL_OR_PASSWORD_WRONG_ERROR'
  | 'VOLUNTEER_NOT_DELETED';

export class VolunteerError extends ErrorBase<ErrorName> {}
