"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { useForms } from "@/context/FormsContext";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import useEditBoard from "@/hooks/EditBoard/useEditBoard";
import BoardFormModel from "../../formModels/BoardFormModel";

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
      <BoardFormModel
        windowType={"edit"}
        handleOnClickBg={handleOnClose}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        fields={fields}
        append={append}
        remove={remove}
        autoAddColumn={autoAddColumn}
      />
    </>
  );
}
