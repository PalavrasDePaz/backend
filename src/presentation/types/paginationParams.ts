import { Request } from 'express';
import { Order } from 'sequelize';

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  filter?: Request['query'];
  order?: Order;
}
