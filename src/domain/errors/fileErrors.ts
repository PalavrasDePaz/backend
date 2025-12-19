import { ErrorBase } from './error-base';

type ErrorName =
  | 'INVALID_NAME'
  | 'INVALID_FILE_EXTENSION'
  | 'UPLOAD_ERROR'
  | 'SCHEDULE_NOT_FOUND'
  | 'ERROR_DELETING_FILE';

export class FileError extends ErrorBase<ErrorName> {}
