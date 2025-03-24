import {
  ResponseHandler,
  ResponseHandlerThrow,
} from "../../utils/responseHandler";
import UserModel, { IUser } from "./user.model";

export class UserDao {
  async createUser(data: IUser): Promise<IUser> {
    try {
      return await UserModel.create(data);
    } catch (error) {
      console.log("error in register user");
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  }

  async findUserByEmail(email: string): Promise<Object | null> {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      ResponseHandlerThrow.throw(500, false, "Internal server error");
    }
  }
}
