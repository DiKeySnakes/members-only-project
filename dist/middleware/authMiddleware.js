const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res
            .status(401)
            .json({ message: 'You are not authorized to view this resource' });
    }
};
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && res.locals.currentUser.admin) {
        next();
    }
    else {
        res
            .status(403)
            .json({ message: 'You are not authorized to view this resource' });
    }
};
const isMember = (req, res, next) => {
    if (req.isAuthenticated() && res.locals.currentUser.membership) {
        next();
    }
    else {
        res
            .status(403)
            .json({ message: 'You are not authorized to view this resource' });
    }
};
export { isAuth, isAdmin, isMember };
