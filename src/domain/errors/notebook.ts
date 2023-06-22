import { ErrorBase } from '@src/helpers/error-base';

type ErrorName = 'NOTEBOOK_NOT_FOUND' | 'NOTEBOOK_ALREADY_RESERVED_ERROR';

export class NotebookError extends ErrorBase<ErrorName> {}
