import express from "express";
import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "../../middleware/jwt.middleware";

const authRoute = express.Router();

const authController = new AuthController();


authRoute.post("/login", authController.login);
authRoute.post("/signup", authController.signup);
authRoute.post("/refresh-token",  authController.refreshToken);
authRoute.get("/home", AuthMiddleware.verifyToken, authController.home);


export default authRoute;
