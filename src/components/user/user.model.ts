import mongoose, { Model, Schema, trusted } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> = mongoose.model<IUser>("Users", userSchema);

export default UserModel;
