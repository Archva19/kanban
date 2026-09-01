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
        title={"Welcome to Kanban. Create your very first board to get started!"}
        btnTxt={"+ Add New Board"}
        onClickFun={handleOnClick}
      />
    </>
  );
}
