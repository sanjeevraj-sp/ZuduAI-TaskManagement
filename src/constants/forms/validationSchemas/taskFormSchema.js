// src/mocks/validators/taskSchema.js
import Joi from "joi";

const taskSchema = {
  name: Joi.string().min(3).required(),
  assignedUserIds: Joi.array().items(Joi.string()), // user IDs
  priority: Joi.number().valid(0, 1, 2, 3).required(),
  status: Joi.string().valid("Todo", "In Progress", "Completed").required(),
};

export default taskSchema;
