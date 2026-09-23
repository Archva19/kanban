import { useForms } from "@/context/FormsContext";
import {
  formatDueDate,
  isTaskOverdue,
} from "@/hooks/Others/useFormattedDate/useFormattedDate";
import { Task } from "@/types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import AssigneeBtn from "./TaskCardItems/AssigneeBtn";

export default function TaskCard({ task }: { task: Task }) {
  const { setTaskWindowVis, setActiveTask } = useForms();
  const locale = useLocale();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { type: "Task", task } });
  const t = useTranslations("TaskForm");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  function handleOnClickTask(task: Task) {
    setTaskWindowVis(true);
    setActiveTask(task);
  }

  function getCompletedSubTasksLength(task: Task) {
    const completedSubTasksLength = task.subTasks.filter(
      (subTask) => subTask.isCompleted,
    ).length;
    return completedSubTasksLength;
  }

  const formattedDueDate = formatDueDate(task.dueDate, locale);
  const isOverdue = isTaskOverdue(task.dueDate, task.status === "Done");

  return (
    <>
      <div
        id={`task-${task._id}`}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => handleOnClickTask(task)}
        className="group cardBgColor shadow-[0_4px_6px_0_rgba(54,78,126,0.1)] rounded-lg py-5.75 px-4 flex flex-col gap-2 cursor-pointer wrap-break-word relative"
      >
        <div className="flex flex-col gap-2">
          <p className="text-[15px] group-hover:text-[#635FC7] leading-4.75 transition-colors duration-200">
            {task.title}
          </p>
          <p className="text-[12px] text-[#828FA3] leading-3.75">
            {locale === "en"
              ? `${getCompletedSubTasksLength(task)} of ${task.subTasks.length} subtasks`
              : `${task.subTasks.length}-დან ${getCompletedSubTasksLength(task)} ქვედავალება`}
          </p>
        </div>

        {formattedDueDate && (
          <div className="flex flex-col ">
            <p className="text-[11px] transition-colors duration-200">
              {t("dueDate")}
            </p>

            <div
              className={`rounded-md flex items-center gap-1.5 text-[11px] font-medium ${
                isOverdue ? " text-[#EA5555]" : " text-[#828FA3]"
              }`}
            >
              <CalendarDays
                className={`w-3.5 h-3.5 ${
                  isOverdue ? "text-[#EA5555]" : "text-[#828FA3]"
                }`}
              />
              <span>{formattedDueDate}</span>
            </div>
          </div>
        )}
        <AssigneeBtn task={task}/>
      </div>
    </>
  );
}
