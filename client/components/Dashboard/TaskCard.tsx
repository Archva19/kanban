import { useForms } from "@/context/FormsContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function TaskCard({ task }: { task: any }) {
  const { setTaskWindowVis, setActiveTask } = useForms();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { type: "Task", task },});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  function handleOnClickTask(task: any) {
    setTaskWindowVis(true);
    setActiveTask(task);
  }

  function getCompletedSubTasksLength(task: any) {
    const completedSubTasksLength = task.subTasks.filter(
      (subTask: any) => subTask.isCompleted,
    ).length;
    return completedSubTasksLength;
  }

  return (
    <>
      <div
      id={`task-${task._id}`}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => handleOnClickTask(task)}
        className="group cardBgColor shadow-[0_4px_6px_0_rgba(54,78,126,0.1)] rounded-lg py-5.75 px-4 flex flex-col gap-2 cursor-pointer wrap-break-word"
      >
        <p className="text-[15px] group-hover:text-[#635FC7] leading-4.75">
          {task.title}
        </p>
        <p className="text-[12px] text-[#828FA3] leading-3.75">
          {getCompletedSubTasksLength(task)} of {task.subTasks.length} subtasks
        </p>
      </div>
    </>
  );
}
