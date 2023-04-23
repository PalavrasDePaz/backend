import { Router } from 'express';
import { VolunteerAPI } from '@src/presentation/api/volunteer';
import { validate } from 'express-validation';
import { createVolunteerValidator } from '@src/presentation/validators/create-volunteer-validator';
import { loginValidator } from '@src/presentation/validators/login-validator';

export default function volunteerNoAuthRoutes(api: VolunteerAPI): Router {
  const router = Router();
  router.post('/', validate(createVolunteerValidator), api.createVolunteer);
  router.post('/login', validate(loginValidator), api.login);
  return router;
}
