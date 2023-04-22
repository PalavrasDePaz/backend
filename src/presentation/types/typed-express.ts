import { Send, ParamsDictionary } from 'express-serve-static-core';
import { Response, Request } from 'express';
import { ErrorBase } from '@src/helpers/error-base';

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface TypedRequestParams<T extends ParamsDictionary>
  extends Request {
  params: T;
}

export interface TypedRequest<T extends ParamsDictionary, U> extends Request {
  body: U;
  params: T;
}

export interface TypedResponse<ResBody, ErrorType extends ErrorBase<string>>
  extends Response {
  json: Send<ResBody | ErrorType, this>;
}
