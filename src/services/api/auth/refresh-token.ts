import jwt from "jsonwebtoken";
import { env } from "@/lib/env";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { User } from "@/models/user";

export interface RefreshTokenRequest {
  refresh_token: string;
}

export type RefreshTokenResponse = { token: string };

export class RefreshToken {
  async execute(req: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const { refresh_token } = req;

    if (!refresh_token) throw new UnauthorizedError({});

    try {
      const { id, email, username } = jwt.verify(
        refresh_token,
        env.JWT_SECRET
      ) as User;

      const token = jwt.sign({ id, email, username }, env.JWT_SECRET, {
        expiresIn: "1m",
      });

      return { token };
    } catch {
      throw new UnauthorizedError({});
    }
  }
}
