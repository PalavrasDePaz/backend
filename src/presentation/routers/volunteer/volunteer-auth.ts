import { Router } from 'express';
import { VolunteerAPI } from '@src/presentation/api/volunteer';
import autheticationMiddleware from '../../middlewares/authentication';
import { validate } from 'express-validation';
import { getVolunteerByEmailValidator } from '@src/presentation/validators/get-volunteer-by-email-validator';
import { updateVolunteerValidator } from '@src/presentation/validators/update-volunteer-validator';

export default function volunteerAuthRoutes(api: VolunteerAPI): Router {
  const router = Router();
  router.put(
    '/:email',
    autheticationMiddleware,
    validate(updateVolunteerValidator),
    api.updateVolunteer
  );
  router.get(
    '/:email',
    autheticationMiddleware,
    validate(getVolunteerByEmailValidator),
    api.getVolunteerByEmail
  );
  router.get('/', autheticationMiddleware, api.getAllVolunteers);
  router.delete(
    '/:email',
    autheticationMiddleware,
    validate(getVolunteerByEmailValidator),
    api.deleteVolunteer
  );
  return router;
}
