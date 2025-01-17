import { ErrorsConstructor } from "@/models";

export class NotFoundError extends Error {
  constructor(info: ErrorsConstructor) {
    const {
      message = "Recurso não encontrado.",
      statusCode = 404,
      stringCode = "not_resource",
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
