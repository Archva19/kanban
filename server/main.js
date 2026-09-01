require("dotenv").config();
const express = require("express");
const ConnectToMongo = require("./db/connectToMongo");
const cors = require("cors");

const usersRouter = require("./routes/user.router");
const boardsRouter = require("./routes/boards.router");
const authRouter = require("./auth/auth.router");
const tasksRouter = require("./routes/tasks.router");

const app = express();
const PORT = 3030;

app.use(express.json());
app.use(cors());

ConnectToMongo();

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/boards", boardsRouter);
app.use("/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.json({ message: "წარმატებით დარესფონსდა" });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
