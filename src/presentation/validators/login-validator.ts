import { Joi } from 'express-validation';

export const loginValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};
