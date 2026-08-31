"use client";

import { useFieldArray, useForm } from "react-hook-form";
import DeleteIcon from "../models/DeleteIcon";
import { useForms } from "@/context/FormsContext";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import useEditBoard from "@/hooks/EditBoard/useEditBoard";

export default function NewBoard() {
  const { editBoard } = useEditBoard();
  const { setEditBoardVis, setAutoAddColumn, autoAddColumn } = useForms();

  const { activeBoard } = useActiveBoard();

  const initialColumns = activeBoard?.columns?.map((col: any) => ({
    _id: col._id,
    title: col.title,
  })) || [{ title: "" }];

  if (autoAddColumn) {
    initialColumns.push({ title: "" });
  }

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    values: {
      title: activeBoard?.title || "",
      columns: initialColumns,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  if (!activeBoard) return null;

  function handleOnClose() {
    setEditBoardVis(false);
    setAutoAddColumn(false);
  }

  async function onSubmit(data: any) {
    const formattedColumns = data.columns.filter(
      (col: any) => col.title.trim() !== "",
    );

    const newBoard = await editBoard(activeBoard._id, {
      title: data.title,
      columns: formattedColumns,
    });

    handleOnClose();
  }

  return (
    <>
      <div className="formBg" onClick={handleOnClose}>
        <div
          className="cardBgColor formWindow flex flex-col gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <p className="text-[18px]">Edit Board</p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <p className="formTitle">Board Name</p>
              <div className="relative">
                <input
                  className={`${errors.title ? "border-red-500!" : "focusOnInput"}`}
                  type="text"
                  placeholder="e.g. Web Design"
                  {...register("title", {
                    required: "Can’t be empty",
                    maxLength: {
                      value: 15,
                      message: "Input is too long",
                    },
                  })}
                />
                <p className="inputErrorMessage">
                  {errors.title?.message as string}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Board Columns</p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          autoFocus={autoAddColumn && index === fields.length - 1}
                          type="text"
                          {...register(`columns.${index}.title` as const)}
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
                    + Add New Column
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full">
              <button className="purpleBtn formBtn" type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
