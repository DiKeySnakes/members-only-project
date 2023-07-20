import express from 'express';
import {
  membership_get,
  membership_post,
} from '../controllers/authController.js';
import { isAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET request to update Membership status.
router.get('/membership', isAuth, membership_get);

// POST request to update Membership status.
router.post('/membership', isAuth, membership_post);

export default router;
