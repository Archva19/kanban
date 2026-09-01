const { default: mongoose } = require("mongoose");

const subtasksSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const tasksSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status:{
    type:String
  },
  subTasks: {
    type: [subtasksSchema],
    default: [],
  },
});

const columnsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  color: {
    type: String,
  },
  tasks: {
    type: [tasksSchema],
    default: [],
  },
});

const boardsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    columns: {
      type: [columnsSchema],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("boards", boardsSchema);
