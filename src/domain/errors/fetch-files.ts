import { ErrorBase } from './error-base';

type FetchFilesErrorName = 'FILE_NOT_FOUND';

export class FetchFilesError extends ErrorBase<FetchFilesErrorName> {}
