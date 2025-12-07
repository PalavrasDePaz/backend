import { ErrorBase } from './error-base';

type NotebookErrorName =
  | 'NOTEBOOK_NOT_FOUND_ERROR'
  | 'NOTEBOOK_ALREADY_RESERVED_ERROR'
  | 'NOTEBOOK_ALREADY_EVALUATED_ERROR'
  | 'NOTEBOOK_DIRECTORY_NOT_FOUND_ERROR'
  | 'NOTEBOOK_NOT_UPDATED_ERROR';

export class NotebookError extends ErrorBase<NotebookErrorName> {}
