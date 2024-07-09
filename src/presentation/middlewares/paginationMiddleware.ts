import { NextFunction, Request, Response } from 'express';
import { PaginationParams } from '../types/paginationParams';
import { Order } from 'sequelize';

const LIMIT = 30;
export const paginationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pagination: PaginationParams = {
    page: 1,
    limit: LIMIT,
    offset: 0,
    order: [['createdAt', 'DESC']]
  };
  const {
    page = 1,
    limit = LIMIT,
    order,
    ...filter
  } = req.query as Record<string, string>;

  const skip = page ? (+page - 1) * +limit : 0;

  if (order && typeof order === 'string') {
    pagination.order = order.split(',').map((str) => str.split('-')) as Order;
  }

  if (Object.keys(filter).length) {
    pagination.filter = Object.keys(filter).reduce(
      (filterResult, key) => ({
        ...filterResult,
        [String(key)]: filter[key as keyof typeof filter].split(',')
      }),
      {}
    );
  }

  pagination.page = +page;

  pagination.offset = skip;

  pagination.limit = +limit > LIMIT ? LIMIT : +limit;

  req.pagination = pagination;

  return next();
};
