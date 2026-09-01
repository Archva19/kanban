"use client";

import { useForms } from "@/context/FormsContext";
import { useFieldArray, useForm } from "react-hook-form";
import DeleteIcon from "../../../models/DeleteIcon";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import PurpleChevronDown from "../../../models/PurpleChevronDown";
import useEditTask from "@/hooks/EditTask/useEditTask";
import TaskFormModel from "../../formModels/TaskFormModel";

export default function EditTask() {
  const { setEditTaskVis, activeTask } = useForms();
  const { handleEditTask } = useEditTask();
  const { activeBoard } = useActiveBoard();

  const currentColumn = activeBoard?.columns?.find((column: any) =>
    column.tasks?.some((task: any) => task._id === activeTask?._id),
  );

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    values: {
      title: activeTask?.title || "",
      description: activeTask?.description,
      subTasks: activeTask?.subTasks?.map((subtask: any) => ({
        _id: subtask?._id,
        title: subtask?.title,
      })),
      columnId: currentColumn?._id,
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

    await handleEditTask(activeBoard._id, activeTask._id, {
      title: data.title,
      description: data.description,
      subTasks: formattedSubTasks,
      targetedColumnId: data.columnId,
    });

    setEditTaskVis(false);
  }

  const TaskFormModelProps = {
    windowVisState: setEditTaskVis,
    register,
    handleSubmit,
    onSubmit,
    control,
    errors,
    fields,
    append,
    remove,
    activeBoard,
  };

  return (
    <>
      <TaskFormModel
        windowType={"edit"}
        windowVisState={setEditTaskVis}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        fields={fields}
        append={append}
        remove={remove}
        activeBoard={activeBoard}
      />
    </>
  );
}
