import { UserDao } from "./user.dao";
import UserModel, { IUser } from "../user/user.model";
import hashPassword from "../../utils/passwordManager";
import { ResponseHandlerThrow } from "../../utils/responseHandler";
import passwordManager from "../../utils/passwordManager";

class UserService {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  async registerUser(data: IUser) {
    try {
      const pipeline: any[] = [{ $match: { email: data.email.toLowerCase() } }];
      const isUserFound = await UserModel.aggregate(pipeline);

      if (isUserFound.length) {
        ResponseHandlerThrow.throw(400, false, "Email already exist");
      }
      const { firstname, lastname, email, password } = data;
      const hashedPassword = await passwordManager.hashPassword(password);
      const user = {
        firstname,
        lastname,
        email,
        password: hashedPassword,
      };
      const newUser = await this.userDao.createUser(user);
      return newUser;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
