const mongoose = require("mongoose");
require("colors");
const dbConnect = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("mongoDb connected".bgGreen);
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
