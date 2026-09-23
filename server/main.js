require("dotenv").config();
const express = require("express");
const ConnectToMongo = require("./db/connectToMongo");
const cors = require("cors");
const http = require("http");
const { initSocket } = require("./socket");

const usersRouter = require("./routes/user.router");
const boardsRouter = require("./routes/boards.router");
const authRouter = require("./auth/auth.router");
const tasksRouter = require("./routes/tasks.router");
const verifyRouter = require("./auth/verify.router");
const passwordResetRouter = require("./auth/passwordReset.router");
const invitationsRouter = require("./routes/invitations.router");

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://kanban-kappa-jet.vercel.app",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);
ConnectToMongo();

app.use("/auth", authRouter);
app.use("/auth", verifyRouter);
app.use("/auth", passwordResetRouter);
app.use("/users", usersRouter);
app.use("/boards", boardsRouter);
app.use("/invitations", invitationsRouter);
app.use("/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.json({ message: "წარმატებით დარესფონსდა" });
});

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
