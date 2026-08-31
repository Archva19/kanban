"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useForms } from "@/context/FormsContext";
import useTimer from "@/hooks/WindowTimer/useTimer";

export default function BoardDropDown({
  onClose,
  setBoardDropDownVis,
}: {
  onClose: () => void;
  setBoardDropDownVis: (value: boolean) => void;
}) {
  const { startTimer, stopTimer } = useTimer({ onClose });
  const { setDeleteBoardVis, setEditBoardVis } = useForms();

  function handleOnClickDelete() {
    setDeleteBoardVis(true);
    setBoardDropDownVis(false);
  }

  function handleOnClickEdit() {
    setEditBoardVis(true);
    setBoardDropDownVis(false);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
        className="boardDropDown"
      >
        <button
          onClick={handleOnClickEdit}
          className="w-40 text-left text-[#828FA3]"
        >
          Edit Board
        </button>
        <button
          onClick={handleOnClickDelete}
          className="w-40 text-left text-[#EA5555]"
        >
          Delete Board
        </button>
      </motion.div>
    </>
  );
}
