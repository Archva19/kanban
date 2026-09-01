"use client";

import useAddBoard from "@/hooks/AddBoard/useAddBoard";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import DeleteIcon from "../../../models/DeleteIcon";
import { useForms } from "@/context/FormsContext";
import BoardFormModel from "../../formModels/BoardFormModel";

export default function NewBoard() {
  const { createBoard } = useAddBoard();
  const { setNewBoardVis} = useForms();
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

  function handleOnClickBg() {
    setNewBoardVis(false);
  }

  async function onSubmit(data: any) {
    const formattedColumns = data.columns.filter(
      (col: any) => col.title.trim() !== "",
    );

    const newBoard = await createBoard({
      title: data.title,
      columns: formattedColumns,
    });

    handleOnClickBg();
    router.push(`/boards/${newBoard._id}`);
  }

  return (
    <>
      <BoardFormModel
        windowType={"create"}
        handleOnClickBg={handleOnClickBg}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        fields={fields}
        append={append}
        remove={remove}
      />
    </>
  );
}
