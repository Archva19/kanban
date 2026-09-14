const { Router } = require("express");
const boardsModel = require("../models/boards.model");
const isAuth = require("../middlewares/isAuth.middleware");
const usersModel = require("../models/users.model");
const { isValidObjectId } = require("mongoose");
const boardsRouter = Router();

boardsRouter.post("/", isAuth, async (req, res) => {
  try {
    const { title, columns } = req.body;
    const userId = req.userId;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const currentUser = await usersModel.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newBoard = await boardsModel.create({
      title: title.trim(),
      columns: columns || [],
      user: userId,
      isGuest: currentUser.isGuest || false,
    });

    await usersModel.findByIdAndUpdate(userId, {
      $push: { boards: newBoard._id },
    });

    res.json({ message: "creating board was successful", data: newBoard });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

boardsRouter.put("/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, columns } = req.body;
    const userId = req.userId;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

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

    currentBoard.title = title.trim();
    currentBoard.columns = updatedColumns;
    await currentBoard.save();

    return res.json({
      message: "გილოცავ შენ წარმატებით განაახლე მონაცემი",
      data: currentBoard,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

boardsRouter.delete("/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const deletedBoard = await boardsModel.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deletedBoard) {
      return res
        .status(404)
        .json({ message: "Board not found or unauthorized" });
    }

    await usersModel.findByIdAndUpdate(userId, {
      $pull: { boards: id },
    });

    res.json({ message: "Deleting board was successful", data: deletedBoard });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

boardsRouter.patch("/:id/drag", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { columns } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const updatedBoard = await boardsModel.findOneAndUpdate(
      { _id: id, user: userId },
      { columns },
      { new: true },
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    return res.json({ message: "Board updated", data: updatedBoard });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = boardsRouter;
