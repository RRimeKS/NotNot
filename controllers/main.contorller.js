// models
const Note = require("../models/note.model");
//module
const slugify = require("slugify");
//middlewares
const apiFeatures = require("../utils/apiFeatures");
const apiError = require("../utils/apiError");

// homepage
exports.homepage = (req, res, next) => {
  try {
    res.render("main/index", {
      title: "Anasayfa",
    });
  } catch (error) {
    console.log(error);
  }
};
// notes
exports.get_notes = async (req, res, next) => {
  const page = req.query.page * 1;
  const limit = req.query.limit || 1 * 5;
  const skip = (page - 1) * 5;
  const path = req.path;
  try {
    const note = await Note.find({
      user: req.session.userId,
      $or: [{ title: { $regex: req.query.keyword || "" } }],
    })
      .limit(limit)
      .skip(skip);
    res.render("main/notes", {
      title: "Notlarım",
      notes: note,
      path: path,
      currentPage: page,
      noteCount: Math.ceil(note.length / limit),
      keyword: req.body.keyword,
      queryKey: req.query.keyword
    });
  } catch (error) {
    // return next(new apiError(error, 400));
    console.log(error);
  }
};
// Create
exports.get_create_note = async (req, res, next) => {
  try {
    res.render("main/create-note", {
      title: "Not Oluştur",
    });
  } catch (error) {
    console.log(error);
  }
};
exports.post_create_note = async (req, res, next) => {
  const { title, description } = req.body;
  try {
    if (title == "" || description == "") {
      return res.redirect("/notes");
    }
    const note = await Note.create({
      title: title,
      slug: await slugify(title),
      description: description,
      user: req.session.userId,
    });
    req.session.message = { text: `"${note.title}" adlı not oluşturuldu.` };
    return res.redirect("/notes");
  } catch (error) {
    console.log(error);
  }
};
//Get Spesific Note
exports.get_note = async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  try {
    if (note) {
      return res.render("main/selectedNote", {
        title: note.title,
        note: note,
      });
    }
    res.redirect("/note?page=1");
  } catch (error) {
    console.log(error);
  }
};
//edit-note
exports.get_edit_note = async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  try {
    res.render("main/edit-note", {
      title: note.title,
      note: note,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.post_edit_note = async (req, res, next) => {
  const { title, description } = req.body;
  const note = await Note.findById(req.body.noteId);
  try {
    if (note) {
      await note.updateOne({
        title: title,
        description: description,
        slug: slugify(title),
      });
      req.session.message = {
        text: `"${note.title}" adlı note güncellendi`,
        class: "success",
      };
      return res.redirect("/notes?page=1");
    }
    res.redirect("/notes?page=1");
  } catch (error) {
    console.log(error);
  }
};
//delete-note
exports.get_delete_note = async (req, res, next) => {
  const selectedNote = await Note.findById(req.params.id);
  try {
    if (selectedNote) {
      res.render("main/delete-note", {
        title: selectedNote.title + " Adlı Not Siliniyor",
        note: selectedNote
      });
    }
  } catch (error) {
    return next(new apiError(error, 400));
  }
};
exports.post_delete_note = async (req, res, next) => {
  try {
    const selectedNote = await Note.findByIdAndDelete(req.body.noteId);
    return res.redirect("/notes?page=1");
  } catch (error) {
    return next(new apiError(error, 400));
  }
};
