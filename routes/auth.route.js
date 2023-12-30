//express
const route = require("express").Router();

//controller
const authController = require("../controllers/auth.controller");

//login
route.get("/login", authController.get_login);
route.post("/login", authController.post_login);
//register
route.get("/register", authController.get_register);
route.post("/register", authController.post_register);
//logout
route.get("/logout", authController.logout);
//reset-password
route.get("/reset-password", authController.get_reset_password);
route.post("/reset-password", authController.post_reset_password);
//verify-code
route.get("/verify-code", authController.get_verify_code);
route.post("/verify-code", authController.post_verify_code);
//new-password
route.get("/new-password/:token", authController.get_new_password);
route.post("/new-password/:token", authController.post_new_password);
module.exports = route;
