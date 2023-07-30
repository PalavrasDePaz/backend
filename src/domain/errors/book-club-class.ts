import { ErrorBase } from '@src/helpers/error-base';

type ErrorName =
  | 'ESSAY_NOT_FOUND'
  | 'ESSAY_ALREADY_RESERVED_ERROR'
  | 'ESSAY_ALREADY_EVALUATED_ERROR';

export class BookClubClassError extends ErrorBase<ErrorName> {}
