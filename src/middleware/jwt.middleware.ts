import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  ResponseHandler,
  ResponseHandlerThrow,
} from "../utils/responseHandler";
import { IncomingHttpHeaders } from "http";

export class AuthMiddleware {
  public static async createAccessToken(user: any): Promise<object> {
    const accessSecretKey = process.env.ACCESS_SECRET_KEY || "Access secret";
    const refreshSecretKey = process.env.REFRESH_SECRET_KEY || "Refresh secret";

    try {
      const accessToken = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
        },
        accessSecretKey,
        { expiresIn: "10s" }
      );
      const refreshToken = await jwt.sign(
        {
          _id: user._id,
          email: user.email,
        },
        refreshSecretKey,
        { expiresIn: "1h" }
      );
      return { accessToken, refreshToken };
    } catch (error: any) {
      ResponseHandlerThrow.throw(500, false, error);
    }
  }

  public static async createRefreshToken(
    refreshToken: string
  ): Promise<object> {
    const refreshSecretKey = process.env.REFRESH_SECRET_KEY || "Refresh secret";

    try {
      const verifyRefreshToken = await jwt.verify(
        refreshToken,
        refreshSecretKey
      );
      const tokens = this.createAccessToken(verifyRefreshToken);
      return tokens;
    } catch (error: any) {
      ResponseHandlerThrow.throw(500, false, error);
    }
  }

  public static async verifyToken(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accessSecretKey = process.env.ACCESS_SECRET_KEY || "Access secret";
      const refreshSecretKey =
        process.env.REFRESH_SECRET_KEY || "Refresh secret";

      const accessToken: string | undefined =
        request.headers.authorization?.split(" ")[1];
      if (!accessToken) {
        ResponseHandler.error(response, 401, "Invalid Token");
      } else {
        try {
          const verifyRefreshToken = await jwt.verify(
            accessToken,
            accessSecretKey
          );
          console.log(verifyRefreshToken);

          next();
        } catch (error: any) {
          console.log(error);
          ResponseHandler.error(response, 401, error.message);
        }
      }
      next();
    } catch (error: any) {
      ResponseHandler.error(response, 501, "Internal server error");
    }
  }
}
