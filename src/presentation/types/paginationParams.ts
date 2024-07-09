import { Order } from 'sequelize';

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  filter?: Record<string, string[]>;
  order?: Order;
}
