import { ErrorBase } from '@src/helpers/error-base';

type ErrorName = 'COULD_NOT_SEND_EMAIL_ERROR';

export class SendEmailError extends ErrorBase<ErrorName> {}
