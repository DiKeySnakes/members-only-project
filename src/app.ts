import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import './config/passport.js';

dotenv.config();

import compression from 'compression';
import helmet from 'helmet';

const app: Express = express();

// Set up rate limiter: maximum of twenty requests per minute
import RateLimit from 'express-rate-limit';
const limiter = RateLimit({
  windowMs: 1 * 10 * 1000, // 10 seconds
  max: 10,
});
// Apply rate limiter to all requests
app.use(limiter);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI!);
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
}

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net'],
    },
  })
);

app.use(compression()); // Compress all routes

app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// routes
app.get('/', (req: Request, res: Response) => {
  if (!req.user) {
    return res.redirect('/auth/log-in');
  }
  if (res.locals.currentUser.membership) {
    return res.redirect('/message/club');
  }
  if (req.user) {
    return res.redirect('/message/messages');
  } else {
    return res.redirect('/auth/log-in');
  }
});

// auth routes
app.use('/auth', authRoutes);

// message routes
app.use('/message', messageRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
