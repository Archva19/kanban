require("dotenv").config();
const express = require("express");
const ConnectToMongo = require("./db/connectToMongo");

const usersRouter = require("./routes/user.router");
const boardsRouter = require("./routes/boards.router");

const app = express();
const PORT = 3030;

app.use(express.json());

ConnectToMongo();

app.use("/users", usersRouter);
app.use("/boards", boardsRouter);

app.get("/", (req, res) => {
    res.json({message: "წარმატებით დარესფონსდა"})
})

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

