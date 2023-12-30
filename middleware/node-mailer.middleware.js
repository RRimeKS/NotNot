const nodeMailer = require("nodemailer");

const transporter = new nodeMailer.createTransport({
  secureConnection: false,
  tls: {
    ciphers: "SSLv3",
  },
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL,
    pass: process.env.MAIL_PASSWORD,
  },
});

module.exports = transporter;
