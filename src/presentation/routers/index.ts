import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { Router } from 'express';
import { VolunteerAPI } from '@src/presentation/api/volunteer';
import volunteerRoutes from './volunteer/volunteer';

const router = Router();
const volunteerAPI = new VolunteerAPI(new SequelizeVolunteerRepository());
router.use('/volunteer', volunteerRoutes(volunteerAPI));
export default router;
