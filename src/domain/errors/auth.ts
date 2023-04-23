import { ErrorBase } from '@src/helpers/error-base';

type ErrorName =
  | 'EMAIL_OR_PASSWORD_WRONG_ERROR'
  | 'NOT_AUTHENTICATED_ERROR'
  | 'TOKEN_NOT_FOUND_ERROR';

export class AuthError extends ErrorBase<ErrorName> {}
