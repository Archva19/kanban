import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useForms } from "@/context/FormsContext";
import { useUser } from "@/context/UserContext";
import useDeleteBoard from "@/hooks/DeleteBoard/useDeleteBoard";
import DeleteModel from "../../formModels/DeleteModel";
import { useRouter } from "next/navigation";

export default function DeleteBoard({
  startTimer,
}: {
  startTimer: () => void;
}) {
  const router = useRouter();

  const { setDeleteBoardVis, deleteMessageVis, setDeleteMessageVis } =
    useForms();
  const { deleteBoard } = useDeleteBoard();
  const { activeBoard } = useActiveBoard();
  const { boards } = useUser();

  async function handleOnDelete() {
    if (!activeBoard) return;

    const remainingBoards = boards.filter((b) => b._id !== activeBoard._id);

    await deleteBoard(activeBoard._id);
    setDeleteBoardVis(false);
    setDeleteMessageVis(true);
    startTimer();

    if (remainingBoards.length > 0) {
      router.push(`/boards/${remainingBoards[0]._id}`);
    } else {
      router.push("/");
    }
  }

  return (
    <>
      <DeleteModel
        windowType={"board"}
        windowVisState={setDeleteBoardVis}
        title={activeBoard.title}
        handleOnDelete={handleOnDelete}
      />
    </>
  );
}
