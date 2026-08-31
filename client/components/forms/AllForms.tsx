import { useForms } from "@/context/FormsContext";
import NewBoard from "./NewBoard";
import DeleteBoard from "./DeleteBoard";
import useTimer from "@/hooks/WindowTimer/useTimer";
import { AnimatePresence, motion } from "framer-motion";

export default function AllForms() {
  const { newBoardVis, deleteBoardVis, deleteMessageVis, setDeleteMessageVis } =
    useForms();

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
    </>
  );
}
