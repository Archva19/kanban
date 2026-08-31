import { useForms } from "@/context/FormsContext";
import EmptyMessageModel from "../models/EmptyMessageModel";

export default function EmptyBoard() {
  const { setEditBoardVis, setAutoAddColumn } = useForms();

  function handleOnClickNewColumn() {
    setEditBoardVis(true);
    setAutoAddColumn(true);
  }

  return (
    <>
      <EmptyMessageModel
        title={"This board is empty. Create a new column to get started."}
        btnTxt={"+ Add New Column"}
        onClickFun={handleOnClickNewColumn}
      />
    </>
  );
}
