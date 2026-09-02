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
  return res.json({ message: "წარმატებით შეიქმნა task", data: activeBoard });
});

tasksRouter.put("/:boardId/:taskId", isAuth, async (req, res) => {
  const { boardId, taskId } = req.params;
  const { title, description, subTasks, targetedColumnId } = req.body;

  const activeBoard = await boardsModel.findById(boardId);
  if (!activeBoard) {
    return res.status(404).json({ message: "Board not found" });
  }

  let currentTask = null;
  let currentColumn = null;

  for (let i = 0; i < activeBoard.columns.length; i++) {
    const foundTask = activeBoard.columns[i].tasks.id(taskId);
    if (foundTask) {
      currentTask = foundTask;
      currentColumn = activeBoard.columns[i];
      break;
    }
  }

  if (!currentTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  currentTask.title = title || currentTask.title;
  currentTask.description = description || currentTask.description;
  currentTask.subTasks = subTasks || currentTask.subTasks;

  if (targetedColumnId && currentColumn._id.toString() !== targetedColumnId) {
    const targetedColumn = activeBoard.columns.id(targetedColumnId);
    currentColumn.tasks.pull(taskId);
    currentTask.status = targetedColumn.title;
    targetedColumn.tasks.push(currentTask);
  }

  await activeBoard.save();
  return res.json({ message: "Task-ი წარმატებით განახლდა", data: activeBoard });
});

tasksRouter.delete("/:boardId/:taskId", isAuth, async (req, res) => {
  const { boardId, taskId } = req.params;

  const activeBoard = await boardsModel.findById(boardId);
  if (!activeBoard) {
    return res.status(404).json({ message: "Board not found" });
  }

  let currentTask = null;
  let currentColumn = null;

  for (let i = 0; i < activeBoard.columns.length; i++) {
    const foundTask = activeBoard.columns[i].tasks.id(taskId);
    if (foundTask) {
      currentTask = foundTask;
      currentColumn = activeBoard.columns[i];
      break;
    }
  }

  if (!currentTask || !currentColumn) {
    return res.status(404).json({ message: "Task not found" });
  }

  currentColumn.tasks.pull(currentTask);
  await activeBoard.save();
  return res.json({ message: "წარმატებით წაიშალა task", data: activeBoard });
});

tasksRouter.patch(
  "/:boardId/:taskId/subtasks/:subTaskId",
  isAuth,
  async (req, res) => {
    const { boardId, taskId, subTaskId } = req.params;

    const activeBoard = await boardsModel.findById(boardId);
    if (!activeBoard) {
      return res.status(404).json({ message: "board not found" });
    }

    let currentTask = null;

    for (let i = 0; i < activeBoard.columns.length; i++) {
      const foundTask = activeBoard.columns[i].tasks.id(taskId);
      if (foundTask) {
        currentTask = foundTask;
        break;
      }
    }

    if (!currentTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subTask = currentTask.subTasks.id(subTaskId);
    if (!subTask) return res.status(404).json({ message: "Subtask not found" });

    subTask.isCompleted = !subTask.isCompleted;

    await activeBoard.save();

    return res.json({ message: "Subtask status updated", data: activeBoard });
  },
);

module.exports = tasksRouter;
