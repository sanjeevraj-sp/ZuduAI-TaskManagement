import Joi from "joi";

const registerFormSchema = {
  name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(5).required(),
};

export default registerFormSchema;