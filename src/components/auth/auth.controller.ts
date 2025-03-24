import UserService from "./../user/user.service";
import { Request, RequestHandler, Response } from "express";
import {
  ResponseHandler,
  ResponseHandlerThrow,
} from "../../utils/responseHandler";
import { validateUser } from "../user/user.validation";
import AuthService from "./auth.service";
import { AuthMiddleware } from "../../middleware/jwt.middleware";

export class AuthController {
  private userService: UserService;
  private authService: AuthService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  public signup: RequestHandler = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const userData = request.body;
      if (!userData) {
        ResponseHandlerThrow.throw(4004, false, "No body found");
      }
      const validatedUser = validateUser(userData);
      if (validatedUser.error) {
        const errorMessages = validatedUser.error.details
          .map((detail) => detail.message)
          .join(", ");
        ResponseHandlerThrow.throw(404, false, errorMessages);
      }
      const createdUser = await this.userService.registerUser(userData);
      ResponseHandler.success(
        response,
        201,
        "User registered successfully",
        createdUser
      );
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

  public login: RequestHandler = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const { email, password } = request.body;
      if (!email || !password) {
        ResponseHandlerThrow.throw(4004, false, "Enter email and password");
      }

      const tokens = await this.authService.loginUser(email, password);
      ResponseHandler.success(response, 200, "Login successfully", tokens);
    } catch (error: any) {
      ResponseHandler.error(response, error.status, error.message);
    }
  };

  public home: RequestHandler = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      ResponseHandler.success(response, 200, "Login successfully", "home");
    } catch (error) {
      ResponseHandler.error(response, 500, "Internal server error");
    }
  };
  public refreshToken: RequestHandler = async (
    request: Request,
    response: Response
  ): Promise<void> => {
    try {
      const { refreshToken } = request.body;
      if (!refreshToken) {
        ResponseHandlerThrow.throw(400, false, "Enter access token");
      }
      const tokens = await AuthMiddleware.createRefreshToken(refreshToken)
      ResponseHandler.success(response, 200, "Login successfully", tokens);
    } catch (error) {
      ResponseHandler.error(response, 500, "Internal server error");
    }
  };
}
