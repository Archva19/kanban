import ThreeDotsBtnModel from "@/components/models/Buttons/ThreeDotsBtnModel";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useForms } from "@/context/FormsContext";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import useToggleSubtask from "@/hooks/Tasks/ToggleSubtask/useToggleSubtask";
import useEditTask from "@/hooks/Tasks/EditTask/useEditTask";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Column, Subtask, Task } from "@/types/types";
import TaskDropDown from "./TaskDropDown";
import SelectColumnModel from "../../FormItemModels/SelectColumnModel";
import { CalendarDays } from "lucide-react";
import { isTaskOverdue } from "@/hooks/Others/useFormattedDate/useFormattedDate";

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
  const t = useTranslations("TaskWindow");
  const locale = useLocale();

  if (!activeTask || !activeBoard) return null;

  function onClickMenu() {
    setTaskDropDownVis(!taskDropDownVis);
  }

  const completedSubTasksLength = activeTask.subTasks.filter(
    (subTask: Subtask) => subTask.isCompleted,
  ).length;

  function handleOnClickTask(subTaskId: string) {
    if (!activeTask || !activeBoard) return;

    const subTask = activeTask.subTasks.find(
      (st: Subtask) => st._id === subTaskId,
    );

    if (!subTask) return;

    const audio = new Audio("/sounds/taskCheckSoundEffect.MP3");
    audio.volume = 0.4;

    if (!subTask.isCompleted) {
      audio.play().catch(() => {});
    }

    const newIsCompleted = !subTask.isCompleted;

    setActiveTask((prevTask) => {
      if (!prevTask) return null;
      return {
        ...prevTask,
        subTasks: prevTask.subTasks.map((st) =>
          st._id === subTaskId ? { ...st, isCompleted: newIsCompleted } : st,
        ),
      };
    });

    handleToggleSubtask(activeBoard._id, activeTask._id, subTaskId).catch(
      () => {
        setActiveTask((prevTask) => {
          if (!prevTask) return null;
          return {
            ...prevTask,
            subTasks: prevTask.subTasks.map((st) =>
              st._id === subTaskId
                ? { ...st, isCompleted: subTask.isCompleted }
                : st,
            ),
          };
        });
      },
    );
  }

  const currentColumn = activeBoard?.columns.find(
    (column: Column) =>
      column.title === activeTask.status ||
      column.tasks.some((t) => t._id === activeTask._id),
  );
  const currentColumnId = currentColumn?._id;

  async function handleChangeColumn(newColumnId: string) {
    if (newColumnId === currentColumnId || !activeTask || !activeBoard) return;

    const newColumn = activeBoard.columns.find(
      (col) => col._id === newColumnId,
    );

    const previousStatus = activeTask.status;

    if (newColumn) {
      setActiveTask({
        ...activeTask,
        status: newColumn.title,
      });
    }

    await handleEditTask(activeBoard._id, activeTask._id, {
      title: activeTask?.title,
      description: activeTask?.description,
      subTasks: activeTask?.subTasks,
      targetedColumnId: newColumnId,
    }).catch(() => {
      setActiveTask((prev) =>
        prev ? { ...prev, status: previousStatus } : null,
      );
    });
  }

  const [isOpen, setIsOpen] = useState(false);

  function onClickWindow(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsOpen(false);
  }

  async function handleChangeDueDate(newDate: string) {
    if (!activeTask || !activeBoard) return;

    const previousDueDate = activeTask.dueDate;

    setActiveTask((prev) => (prev ? { ...prev, dueDate: newDate } : null));

    await handleEditTask(activeBoard._id, activeTask._id, {
      title: activeTask.title,
      description: activeTask.description,
      dueDate: newDate,
      subTasks: activeTask.subTasks,
      targetedColumnId: currentColumnId || "",
    }).catch(() => {
      setActiveTask((prev) =>
        prev ? { ...prev, dueDate: previousDueDate } : null,
      );
    });
  }

  const rawDateValue = activeTask.dueDate
    ? new Date(activeTask.dueDate).toISOString().split("T")[0]
    : "";

  const isOverdue = isTaskOverdue(
    activeTask.dueDate,
    activeTask.status === "Done",
  );

  return (
    <>
      <motion.div
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        className="formBg"
        onClick={() => setTaskWindowVis(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="cardBgColor relative formWindow overflow-visible!"
          onClick={onClickWindow}
        >
          <div className="flex items-center justify-between">
            <p className="formTitle max-w-[86%] wrap-break-word leading-5.75 max-h-20 overflow-scroll">
              {activeTask.title}
            </p>
            <ThreeDotsBtnModel onClick={onClickMenu} />
          </div>
          <div>
            <p className="wrap-break-word leading-5.75 text-[13px] text-[#828FA3] font-medium max-h-37.5 overflow-scroll">
              {activeTask.description === ""
                ? t("noDescription")
                : activeTask.description}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className={`inputTitle ${isOverdue ? "text-[#EA5555]!" : ""}`}>
              {t("dueDate")}
            </p>
            <div className="relative flex items-center cursor-pointer">
              <input
                type="date"
                value={rawDateValue}
                onChange={(e) => handleChangeDueDate(e.target.value)}
                onClick={(e) => {
                  e.currentTarget.showPicker();
                }}
                className={`inputStyles cursor-pointer w-full [&::-webkit-calendar-picker-indicator]:hidden ${
                  isOverdue
                    ? "border-[#EA5555]! text-[#EA5555]! focus:border-[#EA5555]!"
                    : "focusOnInput"
                }`}
              />
              <CalendarDays
                className={`w-4 h-4 absolute right-3 pointer-events-none ${
                  isOverdue ? "text-[#EA5555]" : "text-[#828FA3]"
                }`}
              />
            </div>
          </div>

          {activeTask.subTasks.length === 0 ? (
            <p className="inputTitle">{t("noSubtasks")}</p>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="inputTitle">
                {locale === "en"
                  ? `Subtasks ${completedSubTasksLength} of
                ${activeTask.subTasks.length}`
                  : `${activeTask.subTasks.length}-დან
                ${completedSubTasksLength} ქვედავალება`}
              </p>
              <div className="flex flex-col gap-2 max-h-50 overflow-y-scroll">
                {activeTask.subTasks.map((subTask: Subtask) => (
                  <button
                    onClick={() => handleOnClickTask(subTask._id)}
                    key={subTask._id}
                    className="bodyBg p-3 flex items-center gap-4 rounded-sm hover:bg-[#635FC7]/25 transition-colors duration-200"
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
                    <div className="max-w-[85.57%] text-left">
                      <p
                        className={`relative text-[12px] wrap-break-word leading-3.75 ${subTask.isCompleted ? " opacity-50 line-through" : ""}`}
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
            <p className="inputTitle">{t("currentStatus")}</p>
            <SelectColumnModel
              columns={activeBoard.columns}
              selectedColumnId={currentColumnId}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              handleOnSelect={handleChangeColumn}
            />
          </div>
          <AnimatePresence>
            {taskDropDownVis && <TaskDropDown />}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
