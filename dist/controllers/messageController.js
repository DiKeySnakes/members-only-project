var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Message from '../models/message.js';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
// Display list of all Messages.
const messages_list = asyncHandler(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allMessages = yield Message.find().sort({ createdAt: -1 }).exec();
    res.render('index', {
        title: 'Message List',
        messages: allMessages,
        user: req.user,
    });
}));
// Display list of all Messages with Club Membership.
const clubMember_list = asyncHandler(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allMessages = yield Message.find()
        .sort({ createdAt: -1 })
        .populate('user')
        .exec();
    res.render('club', {
        title: 'Private Club',
        messages: allMessages,
        user: req.user,
    });
}));
// Display detail page for a specific Message.
const message_details = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get details of message.
    const message = yield Message.findById(req.params.id).populate('user').exec();
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
}));
// Display Message create form on GET.
const message_create_get = (req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
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
    asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
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
        }
        else {
            // Data from form is valid.
            // Save new message.
            yield message.save();
            // New message saved. Redirect to messages page.
            res.redirect('/');
        }
    })),
];
// Display Message delete form on GET.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const message_delete_get = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield Message.findById(req.params.id).populate('user').exec();
    res.render('deleteMessage', {
        title: 'Delete Message',
        message: message,
        user: req.user,
    });
}));
// Handle message delete on POST.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const message_delete_post = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete object and redirect to the list of categories.
    yield Message.findByIdAndRemove(req.body.id);
    res.redirect('/');
}));
// Display message update form on GET.
const message_update_get = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield Message.findById(req.params.id).exec();
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
}));
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
    asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
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
        }
        else {
            // Data from form is valid. Update the record.
            yield Message.findByIdAndUpdate(req.params.id, message);
            // Now message updated. Redirect to messages page.
            res.redirect('/message/' + (message === null || message === void 0 ? void 0 : message._id));
        }
    })),
];
export { messages_list, message_create_get, message_create_post, clubMember_list, message_details, message_delete_get, message_delete_post, message_update_get, message_update_post, };
