module.exports = (req, res, next) => {
    res.locals.isAuth = req.session.isAuth;
    res.locals.name = req.session.name;
    res.locals.userId = req.session.userId;
    res.locals.csrfToken = req.csrfToken();

    next();
};