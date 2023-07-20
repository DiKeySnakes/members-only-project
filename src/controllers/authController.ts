import User from '../models/user.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

import { body, Result, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

// Show User create form on GET.
const user_create_get = (req: Request, res: Response) => {
  res.render('sign-up-form', { title: 'Sign Up' });
};

// Handle User create on POST.
const user_create_post = [
  // Validate and sanitize all fields.
  body('username', 'Username field must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error('Username is already in use');
      }
    })
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
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error('E-mail is already in use');
      }
    })
    .escape(),
  body(
    'password',
    'Password must have at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number and one symbol.'
  )
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
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Extract the validation errors from a request.
    const errors: Result = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('sign-up-form', {
        title: 'Sign Up',
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Create a user object with escaped and trimmed data and encrypted password.
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        try {
          const user = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
          });
          await user.save();
          res.redirect('/auth/log-in');
        } catch (err) {
          return next(err);
        }
      });
      // New user saved. Redirect to log in page.
      res.redirect('/auth/log-in');
    }
  }),
];

// Display Login form on GET.
const log_in_get = (req: Request, res: Response) => {
  res.render('log-in-form', { title: 'Log In' });
};

// Handle Login on POST.
const log_in_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/sign-up',
});

// Handle Logout on GET.
const log_out_get = (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/auth/log-in');
  });
};

// Display Membership form on GET.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const membership_get = asyncHandler(async (req, res, next) => {
  const current = await User.findById(res.locals.currentUser.id).exec();

  res.render('membership', {
    title: 'Private Club',
    current: current,
    user: req.user,
  });
});

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
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Extract the validation errors from a request.
    const errors: Result = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('membership', {
        title: 'Private Club',
        user: req.user,
        errors: errors.array(),
      });
      return;
    } else {
      const id = await User.findById(res.locals.currentUser.id).exec();
      await User.findByIdAndUpdate(id, { $set: { membership: true } });
      res.redirect('/');
    }
  }),
];

export {
  user_create_get,
  user_create_post,
  log_in_get,
  log_in_post,
  log_out_get,
  membership_get,
  membership_post,
};
