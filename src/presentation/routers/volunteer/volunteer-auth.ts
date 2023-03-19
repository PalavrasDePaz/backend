import { Router } from 'express';
import { VolunteerAPI } from '@src/presentation/api/volunteer';
import autheticationMiddleware from '../../middlewares/authentication';

export default function volunteerAuthRoutes(api: VolunteerAPI): Router {
  const router = Router();
  router.post('/update', autheticationMiddleware, api.updateVolunteer);
  router.get('/', autheticationMiddleware, api.getAllVolunteers);
  router.get('/:email', autheticationMiddleware, api.getVolunteerByEmail);
  return router;
}
