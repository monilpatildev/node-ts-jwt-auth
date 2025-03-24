import {AuthMiddleware}  from './../../middleware/jwt.middleware';


import passwordManager from "../../utils/passwordManager";
import { ResponseHandlerThrow } from "../../utils/responseHandler";
import { IUser } from "../user/user.model";
import { UserDao } from "./../user/user.dao";

class AuthService {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  async loginUser(email: string, password: string): Promise<object> {
    try {
      const foundUser: any = await this.userDao.findUserByEmail(email);
      
      if (!foundUser) {
        ResponseHandlerThrow.throw(400, false, "Invalid email or password");
      }

      const decryptedPassword = await passwordManager.comparePassword(
        password,
        foundUser.password
      );

      if (!decryptedPassword) {
        ResponseHandlerThrow.throw(400, false, "Invalid email or password");
      } else {
        const tokens = await AuthMiddleware.createAccessToken(foundUser);
        return tokens;
      }
    } catch (error) {
      throw error;
    }
  }
}
export default AuthService;
