import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
import { ApiError } from '../types/api-error';

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
  console.error(err);
  if (err instanceof ValidateError) {
    // eslint-disable-next-line no-console
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    let formatedErroMsg;

    try {
      formatedErroMsg = Object.keys(err?.fields).reduce((detailsAcc, field) => {
        const message = err?.fields[field].message;
        const issuesArrStr = message.slice(
          message.indexOf('Issues: ') + 'Issues: '.length
        );
        const issuesArr: Record<string, Issue>[] = JSON.parse(issuesArrStr);
        issuesArr.forEach((issue) => Object.assign(detailsAcc, issue));
        return detailsAcc;
      }, {});
    } catch (e) {
      formatedErroMsg = err?.fields;
    }

    return res.status(422).json({
      message: 'Validation Failed',
      details: formatedErroMsg
    });
  } else if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.error);
  } else if (err instanceof Error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      details: err
    });
  }

  next();
}
