import { Router } from 'express';
import { VolunteerAPI } from '@src/presentation/api/volunteer';
import autheticationMiddleware from '../../middlewares/authentication';
import { validate } from 'express-validation';
import { getVolunteerByEmailValidator } from '@src/presentation/validators/get-volunteer-by-email-validator';
import { updateVolunteerValidator } from '@src/presentation/validators/update-volunteer-validator';
import authorizationMiddleware from '@src/presentation/middlewares/authorization';

export default function volunteerAuthRoutes(api: VolunteerAPI): Router {
  const router = Router();
  router.put(
    '/:email',
    autheticationMiddleware,
    validate(updateVolunteerValidator),
    authorizationMiddleware,
    api.updateVolunteer
  );
  router.put(
    '/:email/password',
    autheticationMiddleware,
    authorizationMiddleware,
    api.createOrUpdatePassword
  );
  router.get(
    '/:email',
    autheticationMiddleware,
    validate(getVolunteerByEmailValidator),
    authorizationMiddleware,
    api.getVolunteerByEmail
  );
  router.get('/', autheticationMiddleware, api.getAllVolunteers);
  router.delete(
    '/:email',
    autheticationMiddleware,
    validate(getVolunteerByEmailValidator),
    authorizationMiddleware,
    api.deleteVolunteer
  );
  return router;
}
