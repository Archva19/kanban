"use client";

import { useForms } from "@/context/FormsContext";
import { useFieldArray, useForm } from "react-hook-form";
import DeleteIcon from "../models/DeleteIcon";
import useAddTask from "@/hooks/AddTask/useAddTask";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import PurpleChevronDown from "../models/PurpleChevronDown";

export default function NewTask() {
  const { setNewTaskVis } = useForms();
  const { handleCreateTask } = useAddTask();
  const { activeBoard } = useActiveBoard();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
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
      <div className="formBg" onClick={() => setNewTaskVis(false)}>
        <div
          className="cardBgColor formWindow pb-6 flex flex-col gap-6 md:pb-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <p className="text-[18px]">Add New Task</p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <p className="formTitle">Title</p>
              <div className="relative">
                <input
                  className={`${errors.title ? "border-red-500!" : "focusOnInput"}`}
                  type="text"
                  placeholder="e.g. Take coffee break"
                  {...register("title", {
                    required: "Can’t be empty",
                  })}
                />
                <p className="inputErrorMessage">{errors.title?.message}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="formTitle">Description</p>
              <div className="relative">
                <textarea
                  className="h-28 focusOnInput resize-none"
                  placeholder="e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little."
                  {...register("description")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="formTitle">Subtasks</p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          {...register(`subTasks.${index}.title` as const)}
                          className="w-full p-2 border borderLineColor rounded bg-transparent"
                        />
                      </div>
                      <button type="button" onClick={() => remove(index)}>
                        <DeleteIcon />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="w-full">
                  <button
                    className="lightPurpleBtn formBtn"
                    type="button"
                    onClick={() => append({ title: "" })}
                  >
                    + Add New Subtask
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="formTitle">Status</p>
              <div className="relative">
                <select
                  {...register("columnId")}
                  className="w-full p-3 border border-[#E4EBFA] rounded text-[13px] font-medium bg-transparent appearance-none cursor-pointer focusOnInput outline-none"
                >
                  {activeBoard?.columns.map((col: any) => (
                    <option
                      key={col._id}
                      value={col._id}
                      className="cardBgColor"
                    >
                      {col.title}
                    </option>
                  ))}
                </select>
                <div className="absolute top-1/2 -translate-y-1/2 right-4">
                  <PurpleChevronDown />
                </div>
              </div>
            </div>

            <div className="w-full">
              <button className="purpleBtn formBtn" type="submit">
                Create Task
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
