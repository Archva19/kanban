"use client";

import { useForms } from "@/context/FormsContext";
import useTimer from "@/hooks/WindowTimer/useTimer";
import ModifyDropDownModel from "../models/ModifyDropDownModel";

export default function BoardDropDown({
  onClose,
  setBoardDropDownVis,
}: {
  onClose: () => void;
  setBoardDropDownVis: (value: boolean) => void;
}) {
  const { startTimer, stopTimer } = useTimer({ onClose });
  const { setDeleteBoardVis, setEditBoardVis} = useForms();

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
      <div className="absolute top-14 right-3 md:top-19 md:right-6 xl:top-22.5">
        <ModifyDropDownModel
          subject={"Board"}
          stopTimer={stopTimer}
          startTimer={startTimer}
          handleOnClickEdit={handleOnClickEdit}
          handleOnClickDelete={handleOnClickDelete}
        />
      </div>
    </>
  );
}
