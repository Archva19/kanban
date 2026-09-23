import { useForms } from "@/context/FormsContext";
import NewBoard from "../Forms/Boards/NewBoard";
import EditBoard from "../Forms/Boards/EditBoard";
import useTimer from "@/hooks/Others/WindowTimer/useTimer";
import NewTask from "../Forms/Tasks/NewTask";
import EditTask from "../Forms/Tasks/EditTask";
import DeleteBoard from "../Forms/Boards/DeleteBoard";
import DeleteTask from "../Forms/Tasks/DeleteTask";
import DeleteMessageModel from "@/components/models/Messages/DeleteMessageModel";
import TaskWindow from "../Forms/Tasks/TaskWindow";
import { AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import InviteCollaborator from "../Forms/Collaborators/InviteCollaborator";

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
    collaboratorsWindowVis,
  } = useForms();

  const t = useTranslations("DeleteMessages");

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
        {newBoardVis && <NewBoard key="new-board-modal" />}
        {deleteBoardVis && (
          <DeleteBoard key="delete-board-modal" startTimer={startBoardTimer} />
        )}

        {deleteMessageVis && (
          <DeleteMessageModel
            key="delete-board-message"
            content={t("deleteBoard")}
            startTimer={startBoardTimer}
            stopTimer={stopBoardTimer}
          />
        )}
        {editBoardVis && <EditBoard key="edit-board-modal" />}
        {newTaskVis && <NewTask key="new-task-modal" />}
        {editTaskVis && <EditTask key="edit-task-modal" />}
        {deleteTaskVis && (
          <DeleteTask key="delete-task-modal" startTimer={startTaskTimer} />
        )}
        {deleteTaskMessageVis && (
          <DeleteMessageModel
            key="delete-task-message"
            content={t("deleteTask")}
            startTimer={startTaskTimer}
            stopTimer={stopTaskTimer}
          />
        )}
        {taskWindowVis && <TaskWindow key="task-window-modal" />}
        {collaboratorsWindowVis && (
          <InviteCollaborator key="invite-collaborators-modal" />
        )}
      </AnimatePresence>
    </>
  );
}
