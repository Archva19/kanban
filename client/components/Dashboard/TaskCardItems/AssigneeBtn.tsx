import { BoardUser, Task } from "@/types/types";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import { User } from "lucide-react";
import AssigneeDropDownItem from "./AssigneeDropDownItem";
import DropDownUnassigned from "./DropDownUnassigned";
import useAssignTask from "@/hooks/Tasks/AssignTask/useAssignTask";

export default function AssigneeBtn({ task }: { task: Task }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { activeBoard } = useActiveBoard();
  const { handleAssignTask } = useAssignTask();

  const boardMembers: BoardUser[] = activeBoard
    ? [
        ...(activeBoard.owner ? [activeBoard.owner] : []),
        ...(activeBoard.collaborators || []),
      ]
    : [];

  async function handleChangeAssignee(userId: string | null) {
    if (!task || !activeBoard) return;
    try {
      await handleAssignTask(activeBoard._id, task._id, userId);
    } catch (err) {
      console.error("Error changing assignee:", err);
    } finally {
      setIsPopoverOpen(false);
    }
  }

  return (
    <>
      <div
        className="absolute bottom-3 right-3"
        onClick={(e) => e.stopPropagation()}
      >
        <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              className={`w-7 h-7 rounded-full flex items-center justify-center bg-[#828FA3]/50 transition-all hover:ring-1 hover:ring-[#C084FC] cursor-pointer`}
              title={
                task.assignee
                  ? typeof task.assignee === "object"
                    ? task.assignee.fullName
                    : "Assigned"
                  : "Unassigned"
              }
            >
              {task.assignee && typeof task.assignee === "object" ? (
                task.assignee.profilePicture ? (
                  <img
                    src={task.assignee.profilePicture}
                    alt={task.assignee.fullName || "User"}
                    className="object-cover rounded-full w-full h-full"
                  />
                ) : (
                  <span className="text-[11px] font-bold text-[#635FC7]">
                    {task.assignee.fullName?.charAt(0).toUpperCase()}
                  </span>
                )
              ) : (
                <User className="w-4 h-4 text-[white]" />
              )}
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="w-56 p-2 rounded-xl cardBgColor shadow-xl border borderLineColor flex flex-col gap-1"
              side="bottom"
              align="end"
              sideOffset={5}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[11px] font-bold text-[#828FA3] px-2 py-1">
                Assignee
              </p>
              <DropDownUnassigned
                onClick={() => handleChangeAssignee(null)}
                task={task}
              />
              <div className="h-px my-1 border-b borderLineColor" />
              <div className="max-h-40 overflow-y-auto flex flex-col gap-1">
                {boardMembers.map((member) => {
                  const isSelected = Boolean(
                    task.assignee &&
                    typeof task.assignee === "object" &&
                    task.assignee._id === member._id,
                  );

                  return (
                    <AssigneeDropDownItem
                      key={member._id}
                      isSelected={isSelected}
                      onClick={() => handleChangeAssignee(member._id)}
                      member={member}
                    />
                  );
                })}
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </>
  );
}
