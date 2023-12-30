//routes
const mainRoute = require("./main.route");
const authRoute = require("./auth.route");

const mountRoute = (app) => {
  app.use(authRoute);
  app.use(mainRoute);
};

module.exports = mountRoute;