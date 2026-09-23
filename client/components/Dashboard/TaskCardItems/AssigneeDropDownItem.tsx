import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useUser } from "@/context/UserContext";
import { BoardUser, Task } from "@/types/types";
import { Check, User } from "lucide-react";

export default function AssigneeDropDownItem({
  isSelected,
  onClick,
  member,
}: {
  isSelected: boolean;
  onClick: () => void;
  member: BoardUser;
}) {

  const {userData} = useUser();

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          isSelected
            ? "bg-[#635FC7]/10 text-[#635FC7]"
            : "hover:bg-[#828FA3]/30"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {member.profilePicture ? (
            <img
              src={member.profilePicture}
              alt={member.fullName}
              className="rounded-full object-cover w-7 h-7"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#635FC7]/20 text-[#635FC7] flex items-center justify-center text-[10px]">
              {member.fullName?.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="truncate">{member.fullName} {userData?._id === member._id && "(You)"}</span>
        </div>
        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
      </button>
    </>
  );
}
