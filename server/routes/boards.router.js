const { Router } = require("express");
const boardsModel = require("../models/boards.model");
const boardsRouter = Router();

boardsRouter.get("/", async (req, res) => {
  const findBoards = await boardsModel.find();
  res.json({ message: "წარმატებით წამოიღე boards-ები", data: findBoards});
});

module.exports = boardsRouter;
