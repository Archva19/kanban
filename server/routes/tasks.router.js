const { Router } = require("express");
const boardsModel = require("../models/boards.model");
const isAuth = require("../middlewares/isAuth.middleware");
const tasksRouter = Router();

tasksRouter.post("/:boardId", isAuth, async (req, res) => {
  const { boardId } = req.params;
  const { title, description, subTasks, columnId } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Task title is required" });
  }

  const activeBoard = await boardsModel.findById(boardId);
  if (!activeBoard) {
    return res.status(404).json({ message: "Board not found" });
  }

  const column = activeBoard.columns.id(columnId);
  if (!column) {
    return res.status(404).json({ message: "Column not found" });
  }

  const newTask = {
    title,
    description,
    status: column.title,
    subTasks,
  };

  column.tasks.push(newTask);
  await activeBoard.save();
  return res.json({message: "წარმატებით შეიქმნა task", data: activeBoard})
});

module.exports = tasksRouter;


