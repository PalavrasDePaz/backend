import { ErrorBase } from './error-base';

type ErrorName = 'EVALUATION_NOT_FOUND_ERROR' | 'EVALUATION_NOT_UPDATED_ERROR';

export class BookEvaluationError extends ErrorBase<ErrorName> {}
