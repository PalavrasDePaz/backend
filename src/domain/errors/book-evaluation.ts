import { ErrorBase } from './error-base';

type BookEvaluationErrorName =
  | 'EVALUATION_NOT_FOUND_ERROR'
  | 'EVALUATION_NOT_UPDATED_ERROR';

export class BookEvaluationError extends ErrorBase<BookEvaluationErrorName> {}
