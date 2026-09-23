import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useForms } from "@/context/FormsContext";
import useDeleteBoard from "@/hooks/Boards/DeleteBoard/useDeleteBoard";
import DeleteModel from "../../FormModels/DeleteModel";

export default function DeleteBoard({
  startTimer,
}: {
  startTimer: () => void;
}) {

  const { setDeleteBoardVis } = useForms();
  const { deleteBoard} = useDeleteBoard();
  const { activeBoard } = useActiveBoard();

  async function handleOnDelete() {
    if (!activeBoard) return;
    await deleteBoard(activeBoard._id, startTimer);
  }

  return (
    <>
      <DeleteModel
        windowType={"board"}
        windowVisState={setDeleteBoardVis}
        title={activeBoard?.title}
        handleOnDelete={handleOnDelete}
      />
    </>
  );
}
