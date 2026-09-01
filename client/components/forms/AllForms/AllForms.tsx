import { useForms } from "@/context/FormsContext";
import NewBoard from "../formItems/boards/NewBoard";
import DeleteBoard from "../DeleteBoard";
import EditBoard from "../formItems/boards/EditBoard";
import useTimer from "@/hooks/WindowTimer/useTimer";
import { AnimatePresence, motion } from "framer-motion";
import NewTask from "../formItems/tasks/NewTask";
import EditTask from "../formItems/tasks/EditTask";

export default function AllForms() {
  const {
    newBoardVis,
    deleteBoardVis,
    deleteMessageVis,
    setDeleteMessageVis,
    editBoardVis,
    newTaskVis,
    editTaskVis,
  } = useForms();

  function onCloseDeleteMessage() {
    setDeleteMessageVis(false);
  }

  const { startTimer, stopTimer } = useTimer({ onClose: onCloseDeleteMessage });

  return (
    <>
      {newBoardVis && <NewBoard />}
      {deleteBoardVis && <DeleteBoard startTimer={startTimer} />}
      <AnimatePresence>
        {deleteMessageVis && (
          <motion.div
            initial={{ bottom: -30 }}
            animate={{ bottom: 8 }}
            exit={{ bottom: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onMouseEnter={stopTimer}
            onMouseLeave={startTimer}
            className="absolute px-4 py-2 bg-[#EA5555] bottom-2 right-2 rounded-sm text-[12px]"
          >
            Board Was Deleted
          </motion.div>
        )}
      </AnimatePresence>
      {editBoardVis && <EditBoard />}
      {newTaskVis && <NewTask />}
      {editTaskVis && <EditTask />}
    </>
  );
}
