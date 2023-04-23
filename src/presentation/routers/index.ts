import { SequelizeVolunteerRepository } from '@src/services/repositories/sequelize-volunteer-repository';
import { Router } from 'express';
import { VolunteerAPI } from '@src/presentation/api/volunteer';
import volunteerRoutes from './volunteer/volunteer';
import { serve, setup } from 'swagger-ui-express';
import { apiDocumentation } from '@src/docs/apidoc';

const router = Router();
const volunteerAPI = new VolunteerAPI(new SequelizeVolunteerRepository());
router.use('/volunteers', volunteerRoutes(volunteerAPI));
router.use('/documentation', serve, setup(apiDocumentation));
export default router;
