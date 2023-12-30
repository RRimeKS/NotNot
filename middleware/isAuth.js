module.exports = (req, res, next) => {
    if (!req.session.isAuth) {
        req.session.message = {text: "Lütfen Giriş Yapınız.", class: "warning"}
        return res.redirect("/login?returnUrl=" + req.originalUrl);
    }
    next();
}