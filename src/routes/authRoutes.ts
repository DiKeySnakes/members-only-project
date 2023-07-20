import express from 'express';
import {
  user_create_get,
  user_create_post,
  log_in_get,
  log_in_post,
  log_out_get,
  membership_get,
  membership_post,
} from '../controllers/authController.js';
import { isAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET request for Sign Up.
router.get('/sign-up', user_create_get);

// POST request for Sign Up.
router.post('/sign-up', user_create_post);

// GET request for Login.
router.get('/log-in', log_in_get);

// POST request for Login.
router.post('/log-in', log_in_post);

// GET request for Logout.
router.get('/log-out', log_out_get);

// GET request to update Membership status.
router.get('/membership', isAuth, membership_get);

// POST request to update Membership status.
router.post('/membership', isAuth, membership_post);

export default router;
