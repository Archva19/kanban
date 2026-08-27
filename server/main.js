require("dotenv").config();
const express = require("express");
const ConnectToMongo = require("./db/connectToMongo");

const app = express();
const PORT = 3030;

ConnectToMongo();

app.get("/", (req, res) => {
    res.json({message: "წარმატებით დარესფონსდა"})
})

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

