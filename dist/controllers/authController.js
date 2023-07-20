var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
// Handle User create on POST.
const user_create_post = [
    // Validate and sanitize all fields.
    body('username', 'Username field must contain at least 3 characters')
        .trim()
        .isLength({ min: 3 })
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield User.findOne({ username: value });
        if (existingUser) {
            throw new Error('Username is already in use');
        }
    }))
        .escape(),
    body('firstName', 'First name field must contain at least 1 character')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('lastName', 'Last name field must contain at least 1 character')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('email', 'Email must be a type of email')
        .trim()
        .isEmail()
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield User.findOne({ email: value });
        if (existingUser) {
            throw new Error('E-mail is already in use');
        }
    }))
        .escape(),
    body('password', 'Password must have at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number and one symbol.')
        .trim()
        .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
        .escape(),
    body('passwordConfirmation')
        .custom((value, { req }) => {
        return value === req.body.password;
    })
        .escape(),
    // Process request after validation and sanitization.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('sign-up-form', {
                title: 'Sign Up',
                errors: errors.array(),
            });
            return;
        }
        else {
            // Data from form is valid.
            // Create a user object with escaped and trimmed data and encrypted password.
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const user = new User({
                        username: req.body.username,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hashedPassword,
                    });
                    yield user.save();
                    res.redirect('/log-in');
                }
                catch (err) {
                    return next(err);
                }
            }));
            // New user saved. Redirect to log in page.
            res.redirect('/log-in');
        }
    })),
];
// Display Membership form on GET.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const membership_get = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const current = yield User.findById(res.locals.currentUser.id).exec();
    res.render('membership', {
        title: 'Private Club',
        current: current,
        user: req.user,
    });
}));
// Handle Membership form on POST.
const membership_post = [
    body('password', 'Secret phrase does not match').escape(),
    body('passwordConfirmation')
        .custom((value) => {
        return value === "It's piece of cake";
    })
        .escape(),
    // Process request after validation and sanitization.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('membership', {
                title: 'Private Club',
                user: req.user,
                errors: errors.array(),
            });
            return;
        }
        else {
            const id = yield User.findById(res.locals.currentUser.id).exec();
            yield User.findByIdAndUpdate(id, { $set: { membership: true } });
            res.redirect('/');
        }
    })),
];
export { user_create_post, membership_get, membership_post };
