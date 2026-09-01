import { motion } from "framer-motion";

interface ModifyDropDownModelProps {
  subject: string;
  stopTimer: () => void;
  startTimer: () => void;
  handleOnClickEdit: () => void;
  handleOnClickDelete: () => void;
}

export default function ModifyDropDownModel({
  subject,
  stopTimer,
  startTimer,
  handleOnClickEdit,
  handleOnClickDelete,
}:ModifyDropDownModelProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
        className="modifyDropDown"
      >
        <button
          onClick={handleOnClickEdit}
          className="w-40 text-left text-[#828FA3]"
        >
          Edit {subject}
        </button>
        <button
          onClick={handleOnClickDelete}
          className="w-40 text-left text-[#EA5555]"
        >
          Delete {subject}
        </button>
      </motion.div>
    </>
  );
}
