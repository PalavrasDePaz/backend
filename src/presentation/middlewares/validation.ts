import { AuthError } from '@src/domain/errors/auth';
import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';

type Issue = {
  message: string;
  value: unknown;
};

export function validationMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (err instanceof ValidateError) {
    // eslint-disable-next-line no-console
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: Object.keys(err?.fields).reduce((detailsAcc, field) => {
        const message = err?.fields[field].message;
        const issuesArrStr = message.slice(
          message.indexOf('Issues: ') + 'Issues: '.length
        );
        const issuesArr: Record<string, Issue>[] = JSON.parse(issuesArrStr);
        issuesArr.forEach((issue) => Object.assign(detailsAcc, issue));
        return detailsAcc;
      }, {})
    });
  } else if (err instanceof AuthError) {
    return res.status(401).json(err);
  } else if (err instanceof Error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      details: err
    });
  }

  next();
}
