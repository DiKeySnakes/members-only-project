var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
// import passportLocal from 'passport-local';
// import bcrypt from 'bcrypt';
// import User from './models/user.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { user_create_post } from './controllers/authController.js';
import { isAuth, isAdmin } from './middleware/authMiddleware.js';
import './config/passport.js';
dotenv.config();
const app = express();
main().catch((err) => console.log(err));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.connect(process.env.MONGO_URI);
        app.listen(process.env.PORT, () => {
            console.log(`Server is listening on port ${process.env.PORT}`);
        });
    });
}
app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
// auth routes
app.use('/auth', authRoutes);
// message routes
app.use('/message', messageRoutes);
app.get('/', (req, res) => {
    if (res.locals.currentUser.membership) {
        res.redirect('/message/club');
    }
    if (req.user) {
        res.redirect('/message/messages');
    }
    else {
        res.redirect('/log-in');
    }
});
app.get('/sign-up', (req, res) => res.render('sign-up-form', { title: 'Sign Up' }));
app.post('/sign-up', user_create_post);
app.get('/log-in', (req, res) => {
    res.render('log-in-form', { title: 'Log In' });
});
app.post('/log-in', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-up',
}));
app.get('/log-out', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/log-in');
    });
});
app.get('/protected', isAuth, (req, res) => {
    res.json({ message: 'Protected Route' });
});
app.get('/protected-admin', isAdmin, (req, res) => {
    res.json({ message: 'Protected Admin Route' });
});
// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
