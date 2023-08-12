import { ErrorBase } from './error-base';

type ErrorName = 'FILE_NOT_FOUND';

export class FetchFilesError extends ErrorBase<ErrorName> {}
