export class ErrorBase<T extends string> extends Error {
  name: T | 'UNSPECIFIED_ERROR';
  message: string;
  details: unknown;

  constructor({
    name,
    message,
    details
  }: {
    name: T | 'UNSPECIFIED_ERROR';
    message: string;
    details?: unknown;
  }) {
    super();
    this.name = name;
    this.message = message;
    this.details = details;
  }
}
