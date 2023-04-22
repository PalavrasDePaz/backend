import { Joi } from 'express-validation';

export const updateVolunteerValidator = {
  params: Joi.object({
    email: Joi.string().email().required()
  }),
  body: Joi.object({
    name: Joi.string().required(),
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
    needDeclaration: Joi.boolean().required(),
    loggedVolunteer: Joi.object({
      email: Joi.string().email().required(),
      bookPermission: Joi.boolean().allow(null),
      authorPermission: Joi.string().allow(null),
      certificationPermission: Joi.boolean().allow(null),
      readPermission: Joi.boolean().allow(null),
      iat: Joi.number().required(),
      exp: Joi.number().required()
    })
  })
};
