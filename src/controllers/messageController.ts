import Message from '../models/message.js';

import { body, Result, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

// Display list of all Messages.
const messages_list = asyncHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const allMessages = await Message.find().sort({ createdAt: -1 }).exec();
    res.render('index', {
      title: 'Message List',
      messages: allMessages,
      user: req.user,
    });
  }
);

// Display list of all Messages with Club Membership.
const clubMember_list = asyncHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const allMessages = await Message.find()
      .sort({ createdAt: -1 })
      .populate('user')
      .exec();
    res.render('club', {
      title: 'Private Club',
      messages: allMessages,
      user: req.user,
    });
  }
);

// Display detail page for a specific Message.
const message_details = asyncHandler(async (req, res, next) => {
  // Get details of message.
  const message = await Message.findById(req.params.id).populate('user').exec();
  if (message === null) {
    // No results.
    const err = new Error('Message not found');
    // err.status = 404;
    return next(err);
  }

  console.log(message);

  res.render('messageDetails', {
    title: 'Message Details',
    message: message,
    user: req.user,
  });
});

// Display Message create form on GET.
const message_create_get = (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  res.render('createMessage', {
    title: 'Create Message',
    message: Message,
    user: req.user,
  });
};

// Handle Message create on POST.
const message_create_post = [
  // Validate and sanitize title and body fields.
  body('title', 'Message title must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('body', 'Message body must contain at least 5 characters')
    .trim()
    .isLength({ min: 5 })
    .escape(),

  // Process request after validation and sanitization.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors: Result = validationResult(req);

    // Create a message object with escaped and trimmed data.
    const message = new Message({
      title: req.body.title,
      body: req.body.body,
      user: req.user,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('createMessage', {
        title: 'Create Message',
        message: message,
        user: req.user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Save new message.
      await message.save();
      // New message saved. Redirect to messages page.
      res.redirect('/');
    }
  }),
];

// Display Message delete form on GET.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const message_delete_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).populate('user').exec();

  res.render('deleteMessage', {
    title: 'Delete Message',
    message: message,
    user: req.user,
  });
});

// Handle message delete on POST.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const message_delete_post = asyncHandler(async (req, res, next) => {
  // Delete object and redirect to the list of categories.
  await Message.findByIdAndRemove(req.body.id);
  res.redirect('/');
});

// Display message update form on GET.
const message_update_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();

  if (message === null) {
    // No results.
    const err = new Error('Item not found');
    return next(err);
  }

  res.render('createMessage', {
    title: 'Update Message',
    message: message,
    user: req.user,
  });
});

// Handle Message update on POST.
const message_update_post = [
  // Validate and sanitize title and body fields.
  body('title', 'Message title must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('body', 'Message body must contain at least 5 characters')
    .trim()
    .isLength({ min: 5 })
    .escape(),

  // Process request after validation and sanitization.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors: Result = validationResult(req);

    // Create a message object with escaped and trimmed data (and the old id!)
    const message = new Message({
      title: req.body.title,
      body: req.body.body,
      user: req.user,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('createMessage', {
        title: 'Create Message',
        message: message,
        user: req.user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Message.findByIdAndUpdate(req.params.id, message);
      // Now message updated. Redirect to messages page.
      res.redirect('/message/' + message?._id);
    }
  }),
];

export {
  messages_list,
  message_create_get,
  message_create_post,
  clubMember_list,
  message_details,
  message_delete_get,
  message_delete_post,
  message_update_get,
  message_update_post,
};
