import { ErrorsConstructor } from "@/models";

export class UnauthorizedError extends Error {
  constructor(info: ErrorsConstructor) {
    const {
      message = "Não autorizado.",
      statusCode = 401,
      stringCode = "unauthorized",
    } = info;
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.stringCode = stringCode;
    Error.captureStackTrace(this, this.constructor);
  }

  statusCode: number;
  stringCode: string;
}
