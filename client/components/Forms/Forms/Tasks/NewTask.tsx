"use client";

import { useForms } from "@/context/FormsContext";
import { useFieldArray, useForm } from "react-hook-form";
import useAddTask from "@/hooks/Tasks/AddTask/useAddTask";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import TaskFormModel, { TaskFormValues } from "../../FormModels/TaskFormModel";
import { useEffect } from "react";

export interface NewTaskFormInputs {
  title: string;
  description: string;
  subTasks: { title: string }[];
  columnId: string;
}

export default function NewTask() {
  const { setNewTaskVis } = useForms();
  const { handleCreateTask } = useAddTask();
  const { activeBoard } = useActiveBoard();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      subTasks: [{ title: "" }, { title: "" }],
      columnId: activeBoard?.columns?.[0]?._id,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subTasks",
  });

  useEffect(() => {
    if (activeBoard?.columns?.[0]?._id) {
      setValue("columnId", activeBoard.columns[0]._id);
    }
  }, [activeBoard, setValue]);

  if (!activeBoard) return null;

  async function onSubmit(data: TaskFormValues) {
    if (!activeBoard?._id) return;

    const formattedSubTasks = data.subTasks.filter(
      (subTask:{ title: string }) => subTask.title.trim() !== "",
    );

    await handleCreateTask(activeBoard._id, {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      subTasks: formattedSubTasks,
      columnId: data.columnId,
    });

    setNewTaskVis(false);
  }

  return (
    <>
      <TaskFormModel
        windowType={"create"}
        windowVisState={setNewTaskVis}
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
