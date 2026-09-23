import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useForms } from "@/context/FormsContext";
import { Users } from "lucide-react";

export default function CollaboratorsBtn() {
  const { SetCollaboratorsWindowVis } = useForms();
  const { activeBoard } = useActiveBoard();

  return (
    <>
      {activeBoard && (
        <button
          onClick={() => SetCollaboratorsWindowVis(true)}
          className="flex items-center justify-center bg-[#828FA3] rounded-full p-1"
        >
          <Users className="w-4 h-4 text-white" />
        </button>
      )}
    </>
  );
}
