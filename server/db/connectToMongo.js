const { default: mongoose } = require("mongoose");
const usersModel = require("../models/users.model");
const boardsModel = require("../models/boards.model");

async function ConnectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await usersModel.syncIndexes();
    await boardsModel.syncIndexes();
    console.log("დაკავშირდა წარმატებით");
  } catch (error) {
    console.log("ეს ერორი მოდის მუნგუსის ქონექთიდან");
  }
}

module.exports = ConnectToMongo;
