import Joi from 'joi';

const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(100).required(),
  confirmPassword: Joi.string().min(4).max(100).required(),
});

export default registerSchema;
