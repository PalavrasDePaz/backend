import { ErrorBase } from '@src/helpers/error-base';

type ErrorName =
  | 'NOTEBOOK_NOT_FOUND'
  | 'NOTEBOOK_ALREADY_RESERVED_ERROR'
  | 'NOTEBOOK_ALREADY_EVALUATED_ERROR'
  | 'NOTEBOOK_DIRECTORY_NOT_FOUND_ERROR';

export class NotebookError extends ErrorBase<ErrorName> {}
