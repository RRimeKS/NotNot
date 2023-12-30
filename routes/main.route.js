//express
const express = require("express");
const route = express.Router();
//middlewares
const isAuth = require("../middleware/isAuth");
//controllers
const mainController = require("../controllers/main.contorller");

route.get("/", mainController.homepage);
route.get("/notes", isAuth, mainController.get_notes);
//create
route.get("/create-note", isAuth, mainController.get_create_note);
route.post("/create-note", isAuth, mainController.post_create_note);
//Get Spesific Note
route.get("/note/:slug-:id", isAuth, mainController.get_note);
//edit
route.get("/edit/:slug-:id", isAuth, mainController.get_edit_note);
route.post("/edit/:slug-:id", isAuth, mainController.post_edit_note);
//delete
route.get("/delete/:slug-:id", isAuth, mainController.get_delete_note);
route.post("/delete/:slug-:id", isAuth, mainController.post_delete_note);

module.exports = route;
