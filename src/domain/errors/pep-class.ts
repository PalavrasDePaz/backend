import { ErrorBase } from './error-base';

type PepClassErrorName = 'PEP_CLASS_NOT_FOUND' | 'PEP_ClASS_NOT_UPDATED_ERROR';

export class PepClassError extends ErrorBase<PepClassErrorName> {}
