//express
const express = require("express");
const app = express();
let session = require("express-session");

//modules
const csurf = require("csurf");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();
let MongoDBStore = require("connect-mongodb-session")(session);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "?Xhu8nm>%]e$0JV",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: new MongoDBStore({
      uri: process.env.MONGODB_URL,
      collection: "mySessions",
    }),
  })
);
app.use(cookieParser());

//custom modules
const dbConnect = require("./config/dbConnect");
const locals = require("./middleware/locals");
const globalError = require("./middleware/error.middleware");
const mountRoute = require("./routes/index.route");
app.use(csurf());
app.use(locals);

//templating engine
app.set("view engine", "ejs");

//route
mountRoute(app);

//middleware
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/libs", express.static(path.join(__dirname, "/node-modules")));

//error-handling
app.all("*", (req, res, next) => {
  next(
    res.render("partials/404", {
      title: "404",
      errors: [{ msg: "Gitmeye Çalıştığınız Sayfa Bulunamadı!" }],
    })
  );
});
app.use(globalError);
//server
dbConnect();
let port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server started on ${port} port`);
});
