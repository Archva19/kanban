const { Router } = require("express");
const boardsModel = require("../models/boards.model");
const isAuth = require("../middlewares/isAuth.middleware");
const usersModel = require("../models/users.model");
const boardsRouter = Router();

boardsRouter.get("/", async (req, res) => {
  const findBoards = await boardsModel.find();
  res.json({ message: "წარმატებით წამოიღე boards-ები", data: findBoards });
});

boardsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const findBoardAndDelete = await boardsModel.findByIdAndDelete(id);

  await usersModel.updateOne(
    { _id: findBoardAndDelete.user },
    { $pull: { boards: id } },
  );

  return res.json({
    message: "წარმატებით წაიშალა board",
    data: findBoardAndDelete,
  });
});

boardsRouter.post("/", isAuth, async (req, res) => {
  const { title, columns } = req.body;
  const userId = req.userId;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const newBoard = await boardsModel.create({
    title,
    columns: columns || [],
    user: userId,
  });

  await usersModel.findByIdAndUpdate(userId, {
    $push: { boards: newBoard._id },
  });

  res.json({ message: "creating board was successful", data: newBoard });
});

boardsRouter.put("/:id", isAuth, async (req, res) => {
  const { id } = req.params;
  const { title, columns } = req.body;
  const userId = req.userId;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const currentBoard = await boardsModel.findOne({ _id: id, user: userId });

  if (!currentBoard) {
    return res.status(404).json({ message: "Board not found" });
  }

  const existingColumnsMap = new Map(
    currentBoard.columns.map((col) => [col._id.toString(), col]),
  );

  const updatedColumns = (columns || []).map((col) => {
    const colId = col._id ? col._id.toString() : null;

    if (colId && existingColumnsMap.has(colId)) {
      const existingCol = existingColumnsMap.get(colId);
      return {
        _id: existingCol._id,
        title: col.title,
        tasks: existingCol.tasks || [],
      };
    }

    return {
      title: col.title,
      tasks: [],
    };
  });

  currentBoard.title = title;
  currentBoard.columns = updatedColumns;
  await currentBoard.save();

  return res.json({
    message: "გილოცავ შენ წარმატებით განაახლე მონაცემი",
    data: currentBoard,
  });
});

boardsRouter.delete("/:id", isAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const deletedBoard = await boardsModel.findByIdAndDelete(id);

  await usersModel.findByIdAndDelete(userId, {
    $pull: { boards: deletedBoard._id },
  });

  res.json({ message: "Deleting board was successful", data: deletedBoard });
});

boardsRouter.patch("/:id/drag", isAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { columns } = req.body;

  const updatedBoard = await boardsModel.findOneAndUpdate(
    { _id: id, user: userId },
    { columns },
    { new: true },
  );

  if (!updatedBoard) {
    return res.status(404).json({ message: "Board not found" });
  }

  return res.json({ message: "Board updated", data: updatedBoard });
});

module.exports = boardsRouter;
