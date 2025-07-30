import Joi from "joi";

const loginFormSchema = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(5).required(),
};

export default loginFormSchema;