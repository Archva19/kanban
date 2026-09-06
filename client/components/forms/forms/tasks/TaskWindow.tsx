import ThreeDotsBtnModel from "@/components/models/ThreeDotsBtnModel";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useForms } from "@/context/FormsContext";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import TaskDropDown from "./TaskDropDown";
import useToggleSubtask from "@/hooks/ToggleSubtask/useToggleSubtask";
import useEditTask from "@/hooks/EditTask/useEditTask";
import SelectColumnModel from "../../FormItemModels/SelectColumnModel";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

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

  function onClickMenu() {
    setTaskDropDownVis(!taskDropDownVis);
  }

  const completedSubTasksLength = activeTask.subTasks.filter(
    (subTask: any) => subTask.isCompleted,
  ).length;

  function handleOnClickTask(subTaskId: string) {
    if (!activeTask) return;

    const subTask = activeTask.subTasks.find((st: any) => st._id === subTaskId);

    const audio = new Audio("/sounds/taskCheckSoundEffect.MP3");
    audio.volume = 0.4;

    if (!subTask.isCompleted) {
      audio.play().catch(() => {});
    }

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

  async function handleChangeColumn(newColumnId: string) {
    if (newColumnId === currentColumnId) return;
    await handleEditTask(activeBoard._id, activeTask._id, {
      title: activeTask.title,
      description: activeTask.description,
      subTasks: activeTask.subTasks,
      targetedColumnId: newColumnId,
    });
  }

  const [isOpen, setIsOpen] = useState(false);

  function onClickWindow(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsOpen(false);
  }

  const locale = useLocale();

  return (
    <>
      <div className="formBg" onClick={() => setTaskWindowVis(false)}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="cardBgColor relative formWindow overflow-visible!"
          onClick={onClickWindow}
        >
          <div className="flex items-center justify-between">
            <p className="formTitle max-w-[86%] wrap-break-word leading-5.75">
              {activeTask.title}
            </p>
            <ThreeDotsBtnModel onClick={onClickMenu} />
          </div>
          <div>
            <p className="wrap-break-word leading-5.75 text-[13px] text-[#828FA3] font-medium">
              {activeTask.description === ""
                ? t("noDescription")
                : activeTask.description}
            </p>
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
                {activeTask.subTasks.map((subTask: any) => (
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
                        className={`relative text-[12px] wrap-break-word leading-3.75 ${subTask.isCompleted ? " opacity-50" : ""}`}
                      >
                        {subTask.title}

                        <motion.span
                          initial={{ width: "0%" }}
                          animate={{
                            width: subTask.isCompleted ? "100%" : "0%",
                          }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-px bg-current"
                        />
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
      </div>
    </>
  );
}
