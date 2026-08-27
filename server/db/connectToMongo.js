const { default: mongoose } = require("mongoose");

async function ConnectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("დაკავშირდა წარმატებით");
  } catch (error) {
    console.log("ეს ერორი მოდის მუნგუსის ქონექთიდან");
  }
}

module.exports = ConnectToMongo;
