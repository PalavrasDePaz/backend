import { Router } from 'express';
import { VolunteerAPI } from '@src/presentation/api/volunteer';

export default function volunteerRoutes(api: VolunteerAPI): Router {
  const router = Router();
  router.post('/create', api.createVolunteer);
  router.get('/', api.getAllVolunteers);
  router.get('/:email', api.getVolunteerByEmail);

  return router;
}
