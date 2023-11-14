import { PaginationParams } from './paginationParams';

declare module 'express' {
  interface Request {
    pagination?: PaginationParams;
  }
}
