import { useForms } from "@/context/FormsContext";
import { useFieldArray, useForm } from "react-hook-form";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import useEditTask from "@/hooks/Tasks/EditTask/useEditTask";
import TaskFormModel, { TaskFormValues } from "../../FormModels/TaskFormModel";
import { Column, Subtask, Task } from "@/types/types";


export default function EditTask() {
  const { setEditTaskVis, activeTask } = useForms();
  const { handleEditTask } = useEditTask();
  const { activeBoard } = useActiveBoard();

  if (!activeBoard || !activeTask) return null;

  const currentColumn = activeBoard?.columns?.find((column: Column) =>
    column.tasks?.some((task: Task) => task._id === activeTask?._id),
  );

  const formattedDueDate = activeTask?.dueDate
    ? new Date(activeTask.dueDate).toISOString().split("T")[0]
    : "";

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<TaskFormValues>({
    values: {
      title: activeTask?.title || "",
      description: activeTask?.description,
      dueDate: formattedDueDate,
      subTasks: activeTask?.subTasks?.map((subtask: Subtask) => ({
        _id: subtask?._id,
        title: subtask?.title,
      })),
      columnId: currentColumn?._id || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subTasks",
  });

  async function onSubmit(data: TaskFormValues) {
    if (!activeBoard || !activeTask) return;

    const formattedSubTasks = data.subTasks.filter(
      (subTask: { title: string }) => subTask.title.trim() !== "",
    );

    await handleEditTask(activeBoard._id, activeTask._id, {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      subTasks: formattedSubTasks,
      targetedColumnId: data.columnId,
    });

    setEditTaskVis(false);
  }

  return (
    <>
      <TaskFormModel
        windowType={"edit"}
        windowVisState={setEditTaskVis}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        isSubmitting={isSubmitting}
        fields={fields}
        append={append}
        remove={remove}
        activeBoard={activeBoard}
        watch={watch}
        setValue={setValue}
      />
    </>
  );
}
