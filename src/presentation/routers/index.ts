import { SequelizeVolunteerRepository } from '@src/domain/repositories/sequelize-volunteer-repository';
import { Router } from 'express';
import VolunteerRouter from './volunteer';
import { VolunteerAPI } from './volunteer/volunteeer-api';

const router = Router();
router.use(
  '/volunteer',
  new VolunteerRouter(
    new VolunteerAPI(new SequelizeVolunteerRepository())
  ).routes()
);
export default router;
