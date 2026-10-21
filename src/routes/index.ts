import { Router } from 'express';
import attendancesRoutes from './attendances';
import unsecuredVolunteersRoutes from './volunteers/unsecured';
import securedVolunteersRoutes from './volunteers/secured';
import scheduleRoutes from './schedule';
import bookClubClassRoutes from './book-club-class';
import bookEvaluationRoutes from './book-evaluations';
import notebooksRoutes from './notebooks';
import pepClassRoutes from './pep-class';

const router = Router();

// Registrar todas as rotas
router.use('/attendances', attendancesRoutes);
router.use('/volunteers', unsecuredVolunteersRoutes);
router.use('/volunteers', securedVolunteersRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/book-club-class', bookClubClassRoutes);
router.use('/book-evaluations', bookEvaluationRoutes);
router.use('/notebooks', notebooksRoutes);
router.use('/pep-class', pepClassRoutes);

export default router;
