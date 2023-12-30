const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Not Başlığı Boş Bırakılamaz."],
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "Not Açıklaması Boş Bırakılamaz."],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true
  }
});

module.exports = mongoose.model("Note", NoteSchema);
