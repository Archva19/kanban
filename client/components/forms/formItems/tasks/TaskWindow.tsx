import PurpleChevronDown from "@/components/models/PurpleChevronDown";
import ThreeDotsBtnModel from "@/components/models/ThreeDotsBtnModel";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useForms } from "@/context/FormsContext";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import TaskDropDown from "./TaskDropDown";
import useToggleSubtask from "@/hooks/ToggleSubtask/useToggleSubtask";
import useEditTask from "@/hooks/EditTask/useEditTask";

export default function TaskWindow() {
  const { handleEditTask } = useEditTask();
  const { handleToggleSubtask } = useToggleSubtask();
  const {
    activeTask,
    setTaskWindowVis,
    taskDropDownVis,
    setTaskDropDownVis,
    setActiveTask,
  } = useForms();
  const { activeBoard } = useActiveBoard();

  function onClickMenu() {
    setTaskDropDownVis(!taskDropDownVis);
  }

  const completedSubTasksLength = activeTask.subTasks.filter(
    (subTask: any) => subTask.isCompleted,
  ).length;

  function handleOnClickTask(subTaskId: string) {
    if (!activeTask) return;
    const updatedSubtasks = activeTask.subTasks.map((subTask: any) =>
      subTask._id === subTaskId
        ? { ...subTask, isCompleted: !subTask.isCompleted }
        : subTask,
    );
    const updatedTask = { ...activeTask, subTasks: updatedSubtasks };
    setActiveTask(updatedTask);
    handleToggleSubtask(activeBoard._id, activeTask._id, subTaskId).catch(
      () => {
        setActiveTask(activeTask);
      },
    );
  }

  const currentColumn = activeBoard?.columns.find((column: any) =>
    column.tasks.some((task: any) => task._id === activeTask._id),
  );
  const currentColumnId = currentColumn?._id;

  async function handleChangeColumn(e: React.ChangeEvent<HTMLSelectElement>) {
    const newColumnId = e.target.value;
    await handleEditTask(activeBoard._id, activeTask._id, {
      title: activeTask.title,
      description: activeTask.description,
      subTasks: activeTask.subTasks,
      targetedColumnId: newColumnId,
    });
  }

  return (
    <>
      <div className="formBg" onClick={() => setTaskWindowVis(false)}>
        <div
          className="cardBgColor relative formWindow overflow-visible!"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <p className="formTitle">{activeTask.title}</p>
            <ThreeDotsBtnModel onClick={onClickMenu} />
          </div>
          <div className="text-[13px] leading-5.75! text-[#828FA3]">
            <p className="wrap-break-word">
              {activeTask.description === ""
                ? "No Description"
                : activeTask.description}
            </p>
          </div>
          {activeTask.subTasks.length === 0 ? (
            <p className="inputTitle">No Subtasks</p>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="inputTitle">
                Subtasks {completedSubTasksLength} of{" "}
                {activeTask.subTasks.length}
              </p>
              <div className="flex flex-col gap-2 max-h-50 overflow-y-scroll">
                {activeTask.subTasks.map((subTask: any) => (
                  <button
                    onClick={() => handleOnClickTask(subTask._id)}
                    key={subTask._id}
                    className="bodyBg p-3 flex items-center gap-4 rounded-sm hover:bg-[#635FC7]/25"
                  >
                    <div
                      className={`w-4 h-4 rounded-xs flex items-center justify-center pt-[5.82px] pb-[5.18px] pr-[3.97px] pl-[4.28px] ${subTask.isCompleted ? "bg-[#635FC7]" : "cardBgColor  border border-[#828FA33F]"}`}
                    >
                      {subTask.isCompleted && (
                        <Image
                          src="/icons/check.svg"
                          alt=""
                          width={10}
                          height={8}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-[12px] ${subTask.isCompleted ? "line-through opacity-50" : ""}`}
                      >
                        {subTask.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <p className="inputTitle">Status</p>
            <div className="relative">
              <select
                className="focusOnInput"
                value={currentColumnId}
                onChange={handleChangeColumn}
              >
                {activeBoard?.columns.map((col: any) => (
                  <option key={col._id} value={col._id} className="cardBgColor">
                    {col.title}
                  </option>
                ))}
              </select>
              <div className="absolute top-1/2 -translate-y-1/2 right-4">
                <PurpleChevronDown />
              </div>
            </div>
          </div>
          <AnimatePresence>
            {taskDropDownVis && <TaskDropDown />}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
