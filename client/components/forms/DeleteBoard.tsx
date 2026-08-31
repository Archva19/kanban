import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useForms } from "@/context/FormsContext";
import { useUser } from "@/context/UserContext";
import useDeleteBoard from "@/hooks/DeleteBoard/useDeleteBoard";
import useTimer from "@/hooks/WindowTimer/useTimer";
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
      <div className="formBg" onClick={() => setDeleteBoardVis(false)}>
        <div
          className="cardBgColor formWindow pb-6 flex flex-col gap-6 md:pb-10"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[18px] leading-[100%] font-bold text-[#EA5555]">
            Delete this task?
          </p>
          <p className="text-[13px] leading-5.75 text-[#828FA3] font-medium">
            Are you sure you want to delete the ‘{activeBoard.title}’ board?
            This action will remove all columns and tasks and cannot be
            reversed.
          </p>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <button className="formBtn redBtn" onClick={handleOnDelete}>
                Delete
              </button>
            </div>
            <div className="flex-1">
              <button
                className="formBtn lightPurpleBtn"
                onClick={() => setDeleteBoardVis(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
