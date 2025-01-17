import { ErrorsConstructor } from "@/models";

export class ValidationError extends Error {
  constructor(info: ErrorsConstructor) {
    const { message = "Dados inválidos.", statusCode = 422, stringCode = "invalid_data" } = info;
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.stringCode = stringCode;
    Error.captureStackTrace(this, this.constructor);
  }

  statusCode: number;
  stringCode: string;
}
