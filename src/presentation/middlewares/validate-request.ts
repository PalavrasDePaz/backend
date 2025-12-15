import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidateError } from './validation-error';

export interface ValidationSchema {
  body?: z.ZodSchema;
  params?: z.ZodSchema;
  query?: z.ZodSchema;
}

export const validateRequest = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, { message: string; value: unknown }> =
          {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = {
            message: err.message,
            value: err.path.reduce(
              (obj: unknown, key: string | number) =>
                obj?.[key as keyof typeof obj],
              req.body || req.params || req.query
            )
          };
        });
        return next(new ValidateError(fieldErrors, 'Validation Failed'));
      }
      return next(error);
    }
  };
};
