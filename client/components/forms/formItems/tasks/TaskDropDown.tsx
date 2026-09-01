"use client";

import ModifyDropDownModel from "@/components/models/ModifyDropDownModel";
import { useForms } from "@/context/FormsContext";
import useTimer from "@/hooks/WindowTimer/useTimer";

export default function TaskDropDown() {
    
  const { startTimer, stopTimer } = useTimer({
    onClose: () => setTaskDropDownVis(false),
  });

  const {
    setEditTaskVis,
    setDeleteTaskVis,
    setTaskWindowVis,
    setTaskDropDownVis,
  } = useForms();

  function handleOnClickDelete() {
    setDeleteTaskVis(true);
    setTaskWindowVis(false);
    setTaskDropDownVis(false);
  }

  function handleOnClickEdit() {
    setEditTaskVis(true);
    setTaskWindowVis(false);
    setTaskDropDownVis(false);
  }

  return (
    <>
      <div className="absolute top-23.25 -right-16.25">
        <ModifyDropDownModel
          subject={"Task"}
          stopTimer={stopTimer}
          startTimer={startTimer}
          handleOnClickEdit={handleOnClickEdit}
          handleOnClickDelete={handleOnClickDelete}
        />
      </div>
    </>
  );
}
