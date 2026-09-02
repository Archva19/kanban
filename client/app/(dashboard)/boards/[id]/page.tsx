"use client";

import EmptyBoard from "@/components/EmptyMessages/EmptyBoard";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useForms } from "@/context/FormsContext";

export default function Board({}) {
  const { activeBoard } = useActiveBoard();
  const { setEditBoardVis, setAutoAddColumn, setTaskWindowVis, setActiveTask } =
    useForms();

const COLUMN_COLORS = [
  "#49C4E5",
  "#8471F2",
  "#67E2AE", 
  "#FF9800",
  "#E91E63",
  "#00BCD4",
  "#9C27B0",
  "#FFC107", 
  "#00E676", 
  "#FF5722", 
  "#3F51B5",
  "#F44336", 
  "#00E5FF",
  "#AB47BC",
  "#8BC34A",
  "#FF4081",
];

  if (!activeBoard) {
    return null;
  }

  if (activeBoard.columns.length === 0) {
    return <EmptyBoard />;
  }

  function handleOnClickNewColumn() {
    setEditBoardVis(true);
    setAutoAddColumn(true);
  }

  function handleOnClickTask(task: any) {
    setTaskWindowVis(true);
    setActiveTask(task);
  }

  function getCompletedSubTasksLength(task:any) {
    const completedSubTasksLength = task.subTasks.filter(
      (subTask: any) => subTask.isCompleted,
    ).length;
    return completedSubTasksLength;
  }

  return (
    <>
      <div className="w-full h-full">
        <div className="h-full pt-6 flex gap-6 px-6 after:content-[''] after:w-px after:shrink-0">
          {activeBoard?.columns.map((column: any, index: number) => (
            <div
              key={column._id}
              className="min-w-70 flex flex-col gap-6 h-full overflow-scroll"
            >
              <div className="flex gap-3 items-center">
                <div
                  style={{
                    backgroundColor:
                      COLUMN_COLORS[index % COLUMN_COLORS.length],
                  }}
                  className="rounded-full w-3.75 h-3.75"
                ></div>
                <p className="text-[12px] tracking-[2.4px] font-bold text-[#828FA3]">
                  {column.title} ({column.tasks.length})
                </p>
              </div>
              <div className="flex flex-col gap-5 w-full">
                {column.tasks.map((task: any) => (
                  <div
                    onClick={() => handleOnClickTask(task)}
                    key={task._id}
                    className="group cardBgColor rounded-lg py-5.75 px-4 flex flex-col gap-2 cursor-pointer wrap-break-word"
                  >
                    <p className="text-[15px] group-hover:text-[#635FC7]">
                      {task.title}
                    </p>
                    <p className="text-[12px] text-[#828FA3]">
                     {getCompletedSubTasksLength(task)} of {task.subTasks.length} subtasks
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="min-w-70 flex flex-col gap-6 h-full">
            <div className="h-3.75 w-full"></div>
            <button
              onClick={handleOnClickNewColumn}
              className="BgGradient text-[#828FA3] text-[24px] font-bold min-w-70 h-full rounded-md flex items-center justify-center hover:text-[#635FC7]"
            >
              + New Column
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
