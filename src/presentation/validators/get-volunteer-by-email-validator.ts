import { Joi } from 'express-validation';

export const getVolunteerByEmailValidator = {
  params: Joi.object({
    email: Joi.string().email().required()
  })
};
