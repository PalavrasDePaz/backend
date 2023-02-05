import { SequelizeVolunteerRepository } from '@src/domain/repositories/sequelize-volunteer-repository';
import { Router } from 'express';
import volunteerRoutes from './volunteer';
import { VolunteerAPI } from '@src/presentation/api/volunteer';

const router = Router();
router.use(
  '/volunteer',
  volunteerRoutes(new VolunteerAPI(new SequelizeVolunteerRepository()))
);
export default router;
