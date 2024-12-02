import { Router } from 'express';

import userController from '../controllers/UserController';
import authRequired from '../middlewares/authRequired';

const router = new Router();

router.post('/', userController.store);
router.get('/', authRequired, userController.show);
router.put('/', authRequired, userController.update);
router.delete('/', authRequired, userController.delete);

export default router;
