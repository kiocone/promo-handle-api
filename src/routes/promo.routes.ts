import { Router } from 'express';
import { getPromos } from '../controllers/promo.controller.js';
import { validateAuthToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/promos', validateAuthToken, getPromos);

export default router;
