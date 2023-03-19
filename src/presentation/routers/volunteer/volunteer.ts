import { Router } from 'express';
import { VolunteerAPI } from '@src/presentation/api/volunteer';
import volunteerAuthRoutes from './volunteer-auth';
import volunteerNoAuthRoutes from './volunteer-no-auth';

export default function volunteerRoutes(api: VolunteerAPI): Router {
  const router = Router();
  router.use(volunteerAuthRoutes(api));
  router.use(volunteerNoAuthRoutes(api));
  return router;
}
