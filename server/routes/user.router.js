const { Router } = require("express");
const usersModel = require("../models/users.model");
const { isValidObjectId } = require("mongoose");
const isAuth = require("../middlewares/isAuth.middleware");
const boardsModel = require("../models/boards.model");

const usersRouter = Router();

usersRouter.get("/", async (req, res) => {
  const findAllUser = await usersModel.find();
  res.json({
    message: "გილოცავ შენ წარმატებით წამოიღე ინფორმაცია ბაზიდან",
    data: findAllUser,
  });
});

usersRouter.get("/me", isAuth, async (req, res) => {
    try {
        const user = await usersModel.findById(req.userId).select("-password").populate("boards");

        if (!user){
            return res.status(404).json({message: "user not found"});
        }

        res.json({
            message: "successfully fetched user data",
            data: user
        })
    } catch (error) {
        res.status(500).json({message: "Server error", error:error.message})
    }
})

usersRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "invalid id", data: null });
  }
  const findUserById = await usersModel.findById(id).select("-password");
  res.json({
    message: "გილოცავ შენ წარმატებით წამოიღე ინფორმაცია აიდის მიხედვით",
    data: findUserById,
  });
});

usersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "invalid id", data: null });
  }

  await boardsModel.deleteMany({ userId: id });
  const findUserBydId = await usersModel.findByIdAndDelete(id);

  res.json({
    message: "მომხმარებელი წაიშალა წარმატებით",
    data: findUserBydId,
  });
});

usersRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { fullName, email } = req.body;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "invalid id", data: null });
  }

  const findUserByIdAndUpdate = await usersModel.findByIdAndUpdate(
    id,
    { fullName, email },
    { new: true },
  );
  res.json({
    message: "გილოცავ შენ წარმატებით განაახლე მონაცემი",
    data: findUserByIdAndUpdate,
  });
});

module.exports = usersRouter;
