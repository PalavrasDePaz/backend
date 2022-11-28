import { SequelizeVolunteerRepository } from '@src/domain/repositories/sequelize-volunteer-repository';
import { Router } from 'express';
import volunteerRoutes from './volunteer';
import { VolunteerAPI } from './volunteer/volunteeer-api';

const router = Router();
router.use(
  '/volunteer',
  volunteerRoutes(new VolunteerAPI(new SequelizeVolunteerRepository()))
);
export default router;
