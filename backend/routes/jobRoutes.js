import { Router } from 'express';

import JobController from '../controllers/JobController';
import authRequired from '../middlewares/authRequired';

const router = new Router();

router.post('/', authRequired, JobController.store);
router.get('/findAll', authRequired, JobController.index);
router.get('/myjob/:id', authRequired, JobController.show);
router.put('/myjob/:id', authRequired, JobController.update);
router.delete('/:id', authRequired, JobController.delete);

router.get('/getJobsTodayOrTomorrow', authRequired, JobController.getJobsTodayOrTomorrow);
router.get('/totalHoursPerEmployer', authRequired, JobController.totalHoursPerEmployer);
router.get('/totalPerLocation', authRequired, JobController.totalPerLocation);
router.get('/totalHours', authRequired, JobController.totalHours);
router.get('/ByDate', authRequired, JobController.jobsByDate);

export default router;
