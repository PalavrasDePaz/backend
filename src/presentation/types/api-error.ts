import { ErrorBase } from '@src/helpers/error-base';

export class ApiError<T extends string> extends Error {
  statusCode: number;
  error: ErrorBase<T>;
  constructor(statusCode: number, error: ErrorBase<T>) {
    super();
    this.statusCode = statusCode;
    this.error = error;
  }
}
