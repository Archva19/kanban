"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { useForms } from "@/context/FormsContext";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import useEditBoard from "@/hooks/EditBoard/useEditBoard";
import BoardFormModel, {
  BoardFormValues,
} from "../../FormModels/BoardFormModel";
import { Column } from "@/types/types";

export interface EditBoardFormInputs {
  title: string;
  columns: { _id?: string; title: string }[];
}

export default function EditBoard() {
  const { editBoard } = useEditBoard();
  const { setEditBoardVis, setAutoAddColumn, autoAddColumn } = useForms();

  const { activeBoard } = useActiveBoard();

  const baseColumns = activeBoard?.columns?.map((col: Column) => ({
    _id: col._id,
    title: col.title,
  })) || [{ title: "" }];

  const initialColumns = autoAddColumn
    ? [...baseColumns, { title: "" }]
    : baseColumns;

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BoardFormValues>({
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

  async function onSubmit(data: EditBoardFormInputs) {
    if (!activeBoard) return;

    const formattedColumns = data.columns.filter(
      (col) => col.title.trim() !== "",
    );

    await editBoard(activeBoard._id, {
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
        isSubmitting={isSubmitting}
        fields={fields}
        append={append}
        remove={remove}
        autoAddColumn={autoAddColumn}
      />
    </>
  );
}
