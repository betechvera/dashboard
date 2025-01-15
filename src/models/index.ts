export type PageResponse<T> = {
  total: number;
  rows: T[];
  page: number;
  perPage: number;
};
