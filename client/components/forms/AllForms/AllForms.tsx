import { useForms } from "@/context/FormsContext";
import NewBoard from "../formItems/boards/NewBoard";
import EditBoard from "../formItems/boards/EditBoard";
import useTimer from "@/hooks/WindowTimer/useTimer";
import { AnimatePresence, motion } from "framer-motion";
import NewTask from "../formItems/tasks/NewTask";
import EditTask from "../formItems/tasks/EditTask";
import DeleteBoard from "../formItems/boards/DeleteBoard";
import DeleteTask from "../formItems/tasks/DeleteTask";
import DeleteMessageModel from "@/components/models/DeleteMessageModel";
import TaskWindow from "../formItems/tasks/TaskWindow";

export default function AllForms() {
  const {
    newBoardVis,
    deleteBoardVis,
    deleteMessageVis,
    setDeleteMessageVis,
    editBoardVis,
    newTaskVis,
    editTaskVis,
    deleteTaskVis,
    deleteTaskMessageVis,
    setDeleteTaskMessageVis,
    taskWindowVis,
  } = useForms();

  function onCloseDeleteMessage() {
    setDeleteMessageVis(false);
  }

  function onCloseDeleteTaskMessage() {
    setDeleteTaskMessageVis(false);
  }

  const { startTimer: startBoardTimer, stopTimer: stopBoardTimer } = useTimer({
    onClose: onCloseDeleteMessage,
  });

  const { startTimer: startTaskTimer, stopTimer: stopTaskTimer } = useTimer({
    onClose: onCloseDeleteTaskMessage,
  });

  return (
    <>
      {newBoardVis && <NewBoard />}
      {deleteBoardVis && <DeleteBoard startTimer={startBoardTimer} />}
      <DeleteMessageModel
        content={"Board Was Deleted"}
        deleteMessageVis={deleteMessageVis}
        startTimer={startBoardTimer}
        stopTimer={stopBoardTimer}
      />
      {editBoardVis && <EditBoard />}
      {newTaskVis && <NewTask />}
      {editTaskVis && <EditTask />}
      {deleteTaskVis && <DeleteTask startTimer={startTaskTimer} />}
      <DeleteMessageModel
        content={"Task Was Deleted"}
        deleteMessageVis={deleteTaskMessageVis}
        startTimer={startTaskTimer}
        stopTimer={stopTaskTimer}
      />
      {taskWindowVis && <TaskWindow />}
    </>
  );
}
