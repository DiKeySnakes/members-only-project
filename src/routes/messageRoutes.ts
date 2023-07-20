import express from 'express';
import {
  messages_list,
  message_create_get,
  message_create_post,
  clubMember_list,
  message_details,
  message_delete_get,
  message_delete_post,
  message_update_get,
  message_update_post,
} from '../controllers/messageController.js';
import { isAdmin, isAuth, isMember } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET request for creating a Message. NOTE This must come before route that displays Message (uses id).
router.get('/create', isAuth, message_create_get);

// POST request for creating Message.
router.post('/create', isAuth, message_create_post);

// GET request for list of all Messages.
router.get('/messages', isAuth, messages_list);

// GET request for list of all Messages with Club Membership.
router.get('/club', isMember, clubMember_list);

// GET request for one Message.
router.get('/:id', isAdmin, message_details);

// GET request to delete Item.
router.get('/:id/delete', isAdmin, message_delete_get);

// POST request to delete Item.
router.post('/:id/delete', isAdmin, message_delete_post);

// GET request to update Message.
router.get('/:id/update', isAdmin, message_update_get);

// POST request to update Message.
router.post('/:id/update', isAdmin, message_update_post);

export default router;
