import { Joi } from 'express-validation';

export const createVolunteerValidator = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    birthDate: Joi.date().required(),
    phoneNumber: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    ethnicity: Joi.string().required(),
    disability: Joi.string(),
    gender: Joi.string().required(),
    sex: Joi.string(),
    socialName: Joi.string(),
    howFoundPep: Joi.string().required(),
    knowledgePep: Joi.string().required(),
    workshops: Joi.array<string>().required(),
    schooling: Joi.string().required(),
    bachelor: Joi.string(),
    studiesKnowlegde: Joi.string().required(),
    lifeExperience: Joi.string().required(),
    desires: Joi.string().required(),
    rolesPep: Joi.array<string>().required(),
    weekAvailability: Joi.number().required(),
    meetingAvailability: Joi.string().required(),
    interestFutureRoles: Joi.array<string>(),
    contribution: Joi.string().required(),
    needDeclaration: Joi.boolean().required()
  })
};
