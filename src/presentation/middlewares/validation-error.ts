export class ValidateError extends Error {
  public fields: Record<string, { message: string; value: unknown }>;

  constructor(
    fields: Record<string, { message: string; value: unknown }>,
    message?: string
  ) {
    super(message || 'Validation Failed');
    this.fields = fields;
    this.name = 'ValidateError';
    Object.setPrototypeOf(this, ValidateError.prototype);
  }
}
