const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "İsim kısmı boş geçilemez."],
  },
  surname: {
    type: String,
    required: [true, "Soyad kısmı boş geçilemez."],
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Eposta kısmı boş geçilemez."],
    unique: [true, "Bu eposta adresi kullanılmaktadır."],
  },
  password: {
    type: String,
    required: [true, "İsim kısmı boş geçilemez."],
  },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  resetTokenVerifed: { type: Boolean },
});

module.exports = mongoose.model("User", UserSchema);
