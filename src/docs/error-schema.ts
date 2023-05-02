import { JsonObject } from 'swagger-ui-express';

export const errorSchema: JsonObject = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'VOLUNTEER_NOT_FOUND_ERROR'
    },
    message: {
      type: 'string',
      example: 'Volunteer with email test@gmail.com not found'
    },
    details: {
      type: 'object'
    }
  },
  required: ['name', 'message']
};
