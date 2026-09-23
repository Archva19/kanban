import { Task } from "@/types/types";
import { Check, User } from "lucide-react";

export default function DropDownUnassigned({
  onClick,
  task,
}: {
  onClick: () => void;
  task: Task;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          !task.assignee
            ? "bg-[#635FC7]/10 text-[#635FC7]"
            : "hover:bg-[#828FA3]/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#828FA3]/50 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span>Unassigned</span>
        </div>
        {!task.assignee && <Check className="w-3.5 h-3.5" />}
      </button>
    </>
  );
}
