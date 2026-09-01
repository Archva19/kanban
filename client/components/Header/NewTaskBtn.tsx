import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useForms } from "@/context/FormsContext";
import Image from "next/image";

export default function NewTaskBtn() {
  const { activeBoard } = useActiveBoard();
  const { setNewTaskVis } = useForms();
  return (
    <>
      {activeBoard && (
        <button
          onClick={() => setNewTaskVis(true)}
          disabled={activeBoard.columns.length === 0}
          className={`purpleBtn flex items-center justify-center rounded-3xl py-2.5 px-4.5 md:h-12 md:pt-3.75 md:pb-3.5 md:px-[24.5] ${activeBoard.columns.length === 0 && "opacity-25 cursor-not-allowed!"}`}
        >
          <Image
            className="md:hidden"
            src="/icons/+.svg"
            alt="+"
            width={12}
            height={12}
          />
          <p className="hidden md:inline-block text-[15px]">+ Add New Task</p>
        </button>
      )}
    </>
  );
}
