import { ErrorBase } from '@src/helpers/error-base';

type ErrorName =
  | 'VOLUNTEER_NOT_FOUND'
  | 'VOLUNTEER_ALREADY_EXISTS'
  | 'VOLUNTEER_NOT_UPDATED'
  | 'VOLUNTEER_NOT_DELETED';

export class VolunteerError extends ErrorBase<ErrorName> {}
