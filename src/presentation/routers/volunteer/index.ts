import { Router } from 'express';
import { VolunteerAPI } from '@src/presentation/api/volunteer';
import { validate } from 'express-validation';
import { createVolunteerValidator } from '@src/presentation/validators/create-volunteer-validator';

export default function volunteerRoutes(api: VolunteerAPI): Router {
  const router = Router();
  router.post('/update', api.updateVolunteer);
  router.post(
    '/create',
    validate(createVolunteerValidator),
    api.createVolunteer
  );
  router.get('/', api.getAllVolunteers);
  router.get('/:email', api.getVolunteerByEmail);
  return router;
}
