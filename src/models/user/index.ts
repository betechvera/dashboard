export type UserProps = {
  id: number;
  username: string;
  name?: string | null;
  last_name?: string | null;
  email: string;
  password?: string;
};

export class User {
  private props: UserProps;

  get id(): number {
    return this.props.id;
  }

  get username(): string {
    return this.props.username;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string | undefined | null {
    return this.props.name;
  }

  get last_name(): string | undefined | null {
    return this.props.last_name;
  }

  constructor(props: UserProps) {
    this.props = props;
  }
}
