import { Router } from 'express';

import employerController from '../controllers/EmployerController';
import authRequired from '../middlewares/authRequired';

const router = new Router();

router.post('/', authRequired, employerController.store);
router.get('/', authRequired, employerController.index);

export default router;
