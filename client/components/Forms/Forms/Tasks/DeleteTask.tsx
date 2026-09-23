import { useForms } from "@/context/FormsContext";
import DeleteModel from "../../FormModels/DeleteModel";
import useDeleteTask from "@/hooks/Tasks/DeleteTask/useDeleteTask";
import { useActiveBoard } from "@/context/ActiveBoardContext";

export default function DeleteTask({ startTimer }: { startTimer: () => void }) {
  const { setDeleteTaskVis, activeTask, setDeleteTaskMessageVis } = useForms();
  const { handleDeleteTask } = useDeleteTask();
  const { activeBoard } = useActiveBoard();

  if (!activeTask || !activeBoard) return null;

  async function handleOnDelete() {
    if (!activeTask || !activeBoard) return;

    await handleDeleteTask(activeBoard._id, activeTask._id);
    setDeleteTaskVis(false);
    setDeleteTaskMessageVis(true);
    startTimer();
  }

  return (
    <>
      <DeleteModel
        windowType={"task"}
        windowVisState={setDeleteTaskVis}
        title={activeTask.title}
        handleOnDelete={handleOnDelete}
      />
    </>
  );
}
