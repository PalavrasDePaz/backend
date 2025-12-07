import { ErrorBase } from './error-base';

type SendEmailEErrorName = 'COULD_NOT_SEND_EMAIL_ERROR';

export class SendEmailError extends ErrorBase<SendEmailEErrorName> {}
