import { useForms } from "@/context/FormsContext";
import NewBoard from "../forms/boards/NewBoard";
import EditBoard from "../forms/boards/EditBoard";
import useTimer from "@/hooks/WindowTimer/useTimer";
import NewTask from "../forms/tasks/NewTask";
import EditTask from "../forms/tasks/EditTask";
import DeleteBoard from "../forms/boards/DeleteBoard";
import DeleteTask from "../forms/tasks/DeleteTask";
import DeleteMessageModel from "@/components/models/DeleteMessageModel";
import TaskWindow from "../forms/tasks/TaskWindow";
import { AnimatePresence } from "motion/react";

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
      <AnimatePresence>
        {newBoardVis && <NewBoard />}
        {deleteBoardVis && <DeleteBoard startTimer={startBoardTimer} />}

        {deleteMessageVis && (
          <DeleteMessageModel
            content={"Board Was Deleted"}
            startTimer={startBoardTimer}
            stopTimer={stopBoardTimer}
          />
        )}
        {editBoardVis && <EditBoard />}
        {newTaskVis && <NewTask />}
        {editTaskVis && <EditTask />}
        {deleteTaskVis && <DeleteTask startTimer={startTaskTimer} />}
        {deleteTaskMessageVis && (
          <DeleteMessageModel
            content={"Task Was Deleted"}
            startTimer={startTaskTimer}
            stopTimer={stopTaskTimer}
          />
        )}
        {taskWindowVis && <TaskWindow />}
      </AnimatePresence>
    </>
  );
}
