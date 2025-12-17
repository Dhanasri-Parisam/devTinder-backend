const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://Application:Dhanasri88888@cluster0.prdv0tv.mongodb.net/devTinder");
};

module.exports = connectDB;
  