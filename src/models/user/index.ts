export type User = {
  id: number;
  username: string;
  name?: string | null;
  last_name?: string | null;
  email: string;
  password?: string;
  first_login?: boolean;
  admin?: boolean;
};
