import { ErrorBase } from '@src/helpers/error-base';

type ErrorName = 'EMAIL_OR_PASSWORD_WRONG_ERROR' | 'NOT_AUTHORIZED_ERROR';

export class AuthError extends ErrorBase<ErrorName> {}
