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
    { _id: findBoardAndDelete.user},
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

  if (!title || !title.trim() === "") {
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

boardsRouter.delete("/:id", isAuth, async (req, res) => {
    const {id} = req.params;
    const userId = req.userId;

    const deletedBoard = await boardsModel.findByIdAndDelete(id);

    await usersModel.findByIdAndDelete(userId, {
        $pull: {boards: deletedBoard._id}
    })

    res.json({ message: "Deleting board was successful", data: deletedBoard });
})

module.exports = boardsRouter;
