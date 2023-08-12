import { ErrorBase } from './error-base';

type ErrorName =
  | 'ESSAY_NOT_FOUND'
  | 'ESSAY_ALREADY_RESERVED_ERROR'
  | 'ESSAYS_DIRECTORY_NOT_FOUND_ERROR'
  | 'ESSAY_ALREADY_EVALUATED_ERROR';

export class BookClubClassError extends ErrorBase<ErrorName> {}
