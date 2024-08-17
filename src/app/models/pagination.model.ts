export interface PaginatedResponse<T> {
    success: boolean;
    data: {
      list: T[];
      total: number;
      page: number;
      pageSize: number;
    };
  }
  