"use client";

import useAddBoard from "@/hooks/AddBoard/useAddBoard";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import DeleteIcon from "../models/DeleteIcon";
import { useForms } from "@/context/FormsContext";

export default function NewBoard() {
  const { createBoard } = useAddBoard();
  const { setNewBoardVis } = useForms();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      columns: [{ title: "Todo" }, { title: "Doing" }, { title: "Done" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const router = useRouter();

  async function onSubmit(data: any) {
    const formattedColumns = data.columns.filter(
      (col: any) => col.title.trim() !== "",
    );

    const newBoard = await createBoard({
      title: data.title,
      columns: formattedColumns,
    });

    setNewBoardVis(false);
    router.push(`/boards/${newBoard._id}`);
  }

  return (
    <>
      <div className="formBg" onClick={() => setNewBoardVis(false)}>
        <div
          className="cardBgColor formWindow flex flex-col gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <p className="text-[18px]">Add New Board</p>
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
                  })}
                />
                <p className="inputErrorMessage">{errors.title?.message}</p>
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
                Create New Board
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
