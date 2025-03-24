import Joi from "joi";
import { IUser } from "./user.model.js";

export const validateUser = (data: IUser) => {
  const validateSchema = Joi.object({
    firstname: Joi.string().required().messages({
      "string.base": "firstname must be a string",
      "any.required": "firstname is required",
    }),
    lastname: Joi.string().required().messages({
      "string.base": "lastname must be a string",
      "any.required": "lastname is required",
    }),
    email: Joi.string().required().email().lowercase().messages({
      "string.base": "email must be a string",
      "string.email": "email must be a valid email",
      "any.required": "email is required",
    }),
    password: Joi.string().required().messages({
      "string.base": "password must be a string",
      "any.required": "password is required",
    }),
  });

  return validateSchema.validate(data, { abortEarly: false });
};
