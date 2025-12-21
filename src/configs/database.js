const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.mongoString);
  console.log("Connected To DB");
};

module.exports.connectDB = connectDB;
