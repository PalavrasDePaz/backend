import { PaginationParams } from '@src/presentation/types/paginationParams';

export type PaginationResult<TResult> = {
  nodes: TResult;
  pageInfo: {
    page: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  totalCount: number;
};

export const wrapPagination =
  <TResult, TParams extends Array<unknown> = unknown[]>(
    callback: (
      pagination: PaginationParams,
      ...params: TParams
    ) => Promise<[TResult, number]>
  ) =>
  async (
    pagination: PaginationParams,
    ...params: TParams
  ): Promise<PaginationResult<TResult>> => {
    const { limit, offset, page } = pagination;
    const [nodes, totalCount] = await callback(pagination, ...params);

    return {
      nodes,
      pageInfo: {
        page,
        hasNextPage: offset + limit < totalCount,
        hasPreviousPage: offset > 0
      },
      totalCount
    };
  };
