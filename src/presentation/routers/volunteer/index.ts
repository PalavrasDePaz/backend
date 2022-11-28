import { Router } from 'express';
import { VolunteerAPI } from './volunteeer-api';

export default function volunteerRoutes(api: VolunteerAPI): Router {
  const router = Router();
  router.post('/create', api.createVolunteer);
  router.get('/', api.getAllVolunteers);
  router.get('/:email', api.getVolunteerByEmail);

  return router;
}
