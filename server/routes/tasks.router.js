const { Router } = require("express");
const boardsModel = require("../models/boards.model");
const isAuth = require("../middlewares/isAuth.middleware");
const { isValidObjectId } = require("mongoose");
const tasksRouter = Router();
const { getIO } = require("../socket");

async function findAccessibleBoard(boardId, userId) {
  return await boardsModel.findOne({
    _id: boardId,
    $or: [{ owner: userId }, { collaborators: userId }],
  });
}

tasksRouter.post("/:boardId", isAuth, async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, subTasks, columnId, dueDate } = req.body;
    const userId = req.userId;

    if (!isValidObjectId(boardId) || !isValidObjectId(columnId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const activeBoard = await findAccessibleBoard(boardId, userId);
    if (!activeBoard) {
      return res.status(403).json({
        message: "You do not have access to create tasks on this board",
      });
    }

    const column = activeBoard.columns.id(columnId);
    if (!column) {
      return res.status(404).json({ message: "Column not found" });
    }

    const newTask = {
      title: title.trim(),
      description: description || "",
      status: column.title,
      dueDate: dueDate ? new Date(dueDate) : null,
      assignee: null,
      subTasks: subTasks || [],
    };

    column.tasks.push(newTask);
    await activeBoard.save();

    await activeBoard.populate([
      { path: "owner", select: "fullName email profilePicture" },
      { path: "collaborators", select: "fullName email profilePicture" },
      {
        path: "columns.tasks.assignee",
        select: "fullName email profilePicture",
      },
    ]);

    getIO().to(`board:${boardId}`).emit("board_updated", activeBoard);

    return res.json({
      message: "წარმატებით შეიქმნა task",
      data: activeBoard,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

tasksRouter.put("/:boardId/:taskId", isAuth, async (req, res) => {
  try {
    const { boardId, taskId } = req.params;
    const { title, description, subTasks, targetedColumnId, dueDate } =
      req.body;
    const userId = req.userId;

    if (!isValidObjectId(boardId) || !isValidObjectId(taskId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const activeBoard = await findAccessibleBoard(boardId, userId);
    if (!activeBoard) {
      return res.status(403).json({
        message: "You do not have access to edit tasks on this board",
      });
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

    currentTask.title = title.trim() || currentTask.title;
    currentTask.description = description || currentTask.description;

    if (dueDate !== undefined) {
      currentTask.dueDate = dueDate ? new Date(dueDate) : null;
    }

    if (subTasks) {
      const existingSubTasksMap = new Map(
        currentTask.subTasks.map((st) => [st._id.toString(), st]),
      );

      currentTask.subTasks = subTasks.map((subTask) => {
        const subTaskId = subTask._id ? subTask._id.toString() : null;

        if (subTaskId && existingSubTasksMap.has(subTaskId)) {
          const existingSubTask = existingSubTasksMap.get(subTaskId);
          return {
            _id: existingSubTask._id,
            title: subTask.title,
            isCompleted: existingSubTask.isCompleted,
          };
        }

        return {
          title: subTask.title,
          isCompleted: subTask.isCompleted || false,
        };
      });
    }

    if (targetedColumnId && currentColumn._id.toString() !== targetedColumnId) {
      if (!isValidObjectId(targetedColumnId)) {
        return res.status(400).json({ message: "Invalid targeted column ID" });
      }
      const targetedColumn = activeBoard.columns.id(targetedColumnId);
      if (!targetedColumn) {
        return res.status(404).json({ message: "Target column not found" });
      }

      currentColumn.tasks.pull(taskId);
      currentTask.status = targetedColumn.title;
      targetedColumn.tasks.push(currentTask);
    }

    await activeBoard.save();

    await activeBoard.populate([
      { path: "owner", select: "fullName email profilePicture" },
      { path: "collaborators", select: "fullName email profilePicture" },
      {
        path: "columns.tasks.assignee",
        select: "fullName email profilePicture",
      },
    ]);

    getIO().to(`board:${boardId}`).emit("board_updated", activeBoard);

    return res.json({
      message: "Task-ი წარმატებით განახლდა",
      data: activeBoard,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

tasksRouter.delete("/:boardId/:taskId", isAuth, async (req, res) => {
  try {
    const { boardId, taskId } = req.params;
    const userId = req.userId;

    if (!isValidObjectId(boardId) || !isValidObjectId(taskId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const activeBoard = await findAccessibleBoard(boardId, userId);
    if (!activeBoard) {
      return res.status(403).json({
        message: "You do not have access to delete tasks on this board",
      });
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

    await activeBoard.populate([
      { path: "owner", select: "fullName email profilePicture" },
      { path: "collaborators", select: "fullName email profilePicture" },
      {
        path: "columns.tasks.assignee",
        select: "fullName email profilePicture",
      },
    ]);

    getIO().to(`board:${boardId}`).emit("board_updated", activeBoard);

    return res.json({
      message: "წარმატებით წაიშალა task",
      data: activeBoard,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

tasksRouter.patch(
  "/:boardId/:taskId/subtasks/:subTaskId",
  isAuth,
  async (req, res) => {
    try {
      const { boardId, taskId, subTaskId } = req.params;
      const userId = req.userId;

      if (
        !isValidObjectId(boardId) ||
        !isValidObjectId(taskId) ||
        !isValidObjectId(subTaskId)
      ) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const activeBoard = await findAccessibleBoard(boardId, userId);
      if (!activeBoard) {
        return res
          .status(403)
          .json({ message: "Board not found or no access" });
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
      if (!subTask)
        return res.status(404).json({ message: "Subtask not found" });

      subTask.isCompleted = !subTask.isCompleted;

      await activeBoard.save();

      await activeBoard.populate([
        { path: "owner", select: "fullName email profilePicture" },
        { path: "collaborators", select: "fullName email profilePicture" },
        {
          path: "columns.tasks.assignee",
          select: "fullName email profilePicture",
        },
      ]);

      getIO().to(`board:${boardId}`).emit("board_updated", activeBoard);

      return res.json({
        message: "Subtask status updated",
        data: activeBoard,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
);

tasksRouter.patch("/:boardId/:taskId/assignee", isAuth, async (req, res) => {
  try {
    const { boardId, taskId } = req.params;
    const userId = req.userId;
    const { assignee } = req.body;

    if (!isValidObjectId(boardId) || !isValidObjectId(taskId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    if (assignee !== null && !isValidObjectId(assignee)) {
      return res.status(400).json({ message: "Invalid assignee ID format" });
    }

    const activeBoard = await findAccessibleBoard(boardId, userId);
    if (!activeBoard) {
      return res.status(403).json({
        message: "You do not have access to assign tasks on this board",
      });
    }

    if (assignee) {
      const isOwner = activeBoard.owner.toString() === assignee;
      const isCollaborator = activeBoard.collaborators.some(
        (c) => c.toString() === assignee,
      );
      if (!isOwner && !isCollaborator) {
        return res
          .status(400)
          .json({ message: "Assignee must be a board member" });
      }
    }

    let targetTask = null;
    for (let i = 0; i < activeBoard.columns.length; i++) {
      const foundTask = activeBoard.columns[i].tasks.id(taskId);
      if (foundTask) {
        targetTask = foundTask;
        break;
      }
    }

    if (!targetTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    targetTask.assignee = assignee ? assignee : null;

    await activeBoard.save();

    await activeBoard.populate([
      { path: "owner", select: "fullName email profilePicture" },
      { path: "collaborators", select: "fullName email profilePicture" },
      {
        path: "columns.tasks.assignee",
        select: "fullName email profilePicture",
      },
    ]);

    getIO().to(`board:${boardId}`).emit("board_updated", activeBoard);

    return res.json({
      message: "Assignee successfully updated",
      data: activeBoard,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = tasksRouter;
