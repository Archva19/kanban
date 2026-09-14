"use client";

import useAddBoard from "@/hooks/AddBoard/useAddBoard";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useForms } from "@/context/FormsContext";
import BoardFormModel, {
  BoardFormValues,
} from "../../FormModels/BoardFormModel";

export interface NewBoardFormInputs {
  title: string;
  columns: { title: string }[];
}

export default function NewBoard() {
  const { createBoard } = useAddBoard();
  const { setNewBoardVis } = useForms();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BoardFormValues>({
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

  async function onSubmit(data: NewBoardFormInputs) {
    const formattedColumns = data.columns.filter(
      (col) => col.title.trim() !== "",
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
        isSubmitting={isSubmitting}
        fields={fields}
        append={append}
        remove={remove}
      />
    </>
  );
}
