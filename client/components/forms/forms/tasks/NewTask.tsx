"use client";

import { useForms } from "@/context/FormsContext";
import { useFieldArray, useForm } from "react-hook-form";
import useAddTask from "@/hooks/AddTask/useAddTask";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import TaskFormModel from "../../formModels/TaskFormModel";

export default function NewTask() {
  const { setNewTaskVis } = useForms();
  const { handleCreateTask } = useAddTask();
  const { activeBoard } = useActiveBoard();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      subTasks: [{ title: "" }, { title: "" }],
      columnId: activeBoard?.columns?.[0]?._id,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subTasks",
  });

  async function onSubmit(data: any) {
    const formattedSubTasks = data.subTasks.filter(
      (subTask: any) => subTask.title.trim() !== "",
    );

    await handleCreateTask(activeBoard._id, {
      title: data.title,
      description: data.description,
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
