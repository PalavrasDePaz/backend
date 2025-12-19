import { ErrorBase } from './error-base';

type ErrorName =
  | 'NOT_AUTHENTICATED_ERROR'
  | 'TOKEN_NOT_FOUND_ERROR'
  | 'NOT_AUTHORIZED_ERROR';

export class AuthError extends ErrorBase<ErrorName> {}
