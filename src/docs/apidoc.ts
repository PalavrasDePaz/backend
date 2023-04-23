import { JsonObject } from 'swagger-ui-express';
import { createVolunteer, createVolunteerBody } from './volunteers';

const apiDocumentation: JsonObject = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Palavraz de Paz API - Documentation',
    description: 'Documentation of Palavraz de Paz API',
    contact: {
      name: 'João Vitor Silva Ramos',
      email: 'joaovsramosj@gmail.com',
      url: 'https://github.com/JVSRamos'
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  servers: [
    {
      url: 'http://localhost:3333/',
      description: 'Local Server'
    },
    {
      url: 'https://api.mysite.com',
      description: 'Production Server'
    }
  ],
  tags: [
    {
      name: 'Volunteers'
    }
  ],
  paths: {
    users: {
      post: createVolunteer
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'https',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      createVolunteerBody
    }
  }
};

export { apiDocumentation };
