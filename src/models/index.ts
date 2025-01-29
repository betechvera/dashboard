export type PageResponse<T> = {
  total: number;
  rows: T[];
  page: number;
  perPage: number;
};

export type ErrorsConstructor = {
  message?: string;
  statusCode?: number;
  stringCode?: string;
};

export interface AuthenticatedUser {
  id: number;
  email: string;
  username: string;
}
