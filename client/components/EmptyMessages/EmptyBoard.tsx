import { useForms } from "@/context/FormsContext";
import EmptyMessageModel from "../models/EmptyMessageModel";

export default function GetStarted() {
  const { setNewBoardVis } = useForms();

  function handleOnClick() {
    setNewBoardVis(true);
  }
  return (
    <>
      <EmptyMessageModel
        title={"This board is empty. Create a new column to get started."}
        btnTxt={"+ Add New Column"}
        onClickFun={handleOnClick}
      />
    </>
  );
}
