//modules
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
let jwt = require("jsonwebtoken");
//middlewares
const sendMail = require("../middleware/node-mailer.middleware");
const apiError = require("../utils/apiError");
//models
const User = require("../models/user.model");

// Login
exports.get_login = (req, res, next) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    res.render("auth/login", {
      title: "Giriş Yap",
      message: message,
    });
  } catch (error) {
    next(new apiError(error, 400))
  }
};
exports.post_login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  try {
    if (!user) {
      req.session.message = {
        text: "Girdiğiniz Eposta adresinde kayıtlı kullanıcı bulunamadı.",
        class: "danger",
      };
      return res.redirect("/login");
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.name = user.name;
      req.session.userId = user._id;
      req.session.isAuth = true;

      const url = req.query.returnUrl || "/notes";
      return res.redirect(url);
    }
    req.session.message = { text: "Hatalı Parola.", class: "warning" };
    return res.redirect("/login");
  } catch (error) {
    next(new apiError(error, 400))
  }
};
// Register
exports.get_register = (req, res, next) => {
  try {
    res.render("auth/register", {
      title: "Kayıt Ol",
    });
  } catch (error) {
    next(new apiError(error, 400))
  }
};
exports.post_register = async (req, res, next) => {
  const { name, surname, email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      req.session.message = {
        text: "Kayıt olmaya çalıştığınız eposta adresiyle kayıtlı kullanıcı bulunmaktadır",
        class: "warning",
      };
      return res.redirect("/login");
    }

    const hashedPass = await bcrypt.hash(password, 12);
    const createdUser = await User.create({
      name: name,
      surname: surname,
      slug: await slugify(name + "-" + surname),
      email: email,
      password: hashedPass,
    });
    req.session.message = {
      text: "Hesap Başarıyla Oluşturuldu",
      class: "success",
    };
    sendMail.sendMail({
      to: createdUser.email,
      subject: `NotNot'a Hoşgeldin`,
      html: `Merhaba ${createdUser.name}, </br> NotNot hesabın başarıyla oluşturuldu giriş yapmak için link'e tıklayabilirsin. </br> <a href="localhost:5000/login"> `,
    });

    return res.redirect("/login");
  } catch (error) {
    next(new apiError(error, 400))
  }
};

//logout
exports.logout = (req, res, next) => {
  try {
    req.session.destroy();
    return res.redirect("/");
  } catch (error) {
    next(new apiError(error, 400))
  }
};

//reset-password
exports.get_reset_password = async (req, res, next) => {
  try {
    res.render("auth/reset-password", {
      title: "Şifremi Unuttum",
    });
  } catch (error) {
    next(new apiError(error, 400))
  }
};
exports.post_reset_password = async (req, res, next) => {
  const email = req.body.email;
  const checkUser = await User.findOne({ email: email });
  try {
    if (!checkUser) {
      req.session.message = {
        text: "Girdiğiniz eposta ile eşleşen kullanıcı bulunamadı.",
        class: "warning",
      };
      console.log("hata");
      return res.redirect("/login");
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const token = await crypto
      .createHash("sha256")
      .update(resetCode)
      .digest("hex");

    sendMail.sendMail({
      to: checkUser.email,
      subject: "Parolamı Unuttum",
      html: `Merhaba ${checkUser.name.toUpperCase()} </br>  Sana parola sıfırlama kodunu gönderdik lütfen 10dk içinde sıfırlama işlemini gerçekleştir eğer kod sana geç geldiyse yeni istek oluşturmayı unutma
            sıfırlama kodun: <h1>${resetCode}</h1> </br>

            kod doğrulama ekranını kapatırsan buradan tekrar ulaşabilirsin: <a href="localhost:5000/verify-code">Kod doğrulama</a>
            </br>
            localhost:5000/verfiy-code
            `,
    });

    checkUser.resetToken = token;
    checkUser.resetTokenVerifed = false;
    checkUser.resetTokenExpiration = Date.now() + 10 * 60 * 1000;
    await checkUser.save();

    res.redirect("/login");
  } catch (error) {
    checkUser.resetToken = undefined;
    checkUser.resetTokenVerifed = undefined;
    checkUser.resetTokenExpiration = undefined;

    await checkUser.save();

    next(new apiError(error, 400))
  }
};
//verify_code
exports.get_verify_code = async (req, res, next) => {
  try {
    res.render("auth/verify-code", {
      title: "Kodu Doğrula",
    });
  } catch (error) {
    next(new apiError(error, 400))
  }
};
exports.post_verify_code = async (req, res, next) => {
  const verifyCode = req.body.code;
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(verifyCode)
    .digest("hex");

  const user = await User.findOne({
    resetToken: hashedResetToken,
    resetTokenExpiration: { $gt: Date.now() },
  });

  try {
    const token = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "90d" }
    );

    user.resetToken = token;
    user.resetTokenVerifed = true;
    await user.save();

    return res.redirect(`/new-password/${token}`);
  } catch (error) {
    user.resetToken = undefined;
    user.resetTokenVerifed = undefined;
    await user.save();

    next(new apiError(error, 400))
  }
};
//new-password
exports.get_new_password = async (req, res, next) => {
  try {
    res.render("auth/new-password", {
      title: "Yeni Parola",
    });
  } catch (error) {
    next(new apiError(error, 400))
  }
};
exports.post_new_password = async (req, res, next) => {
  const newPassword = req.body.password;
  const token = req.params.token;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
      resetTokenVerifed: true,
    });
    if (!user) {
      req.session.message = {
        text: "Bir hata oluştu lütfen tekrar deneyiniz.",
        class: "danger",
      };
      return res.redirect("/login");
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    user.resetTokenVerifed = undefined;
    await user.save();

    req.session.message = {text: "Parola Sıfırlandı", class: "success"}
    return res.redirect("/login");
  } catch (error) {
    next(new apiError(error, 400))
  }
};