import { useForms } from "@/context/FormsContext";
import EmptyMessageModel from "../models/Messages/EmptyMessageModel";
import { useTranslations } from "next-intl";

export default function EmptyBoard() {
  const { setEditBoardVis, setAutoAddColumn } = useForms();

  function handleOnClickNewColumn() {
    setEditBoardVis(true);
    setAutoAddColumn(true);
  }

  const t = useTranslations("EmptyBoard");

  return (
    <>
      <EmptyMessageModel
        title={t("message")}
        btnTxt={t("btnTxt")}
        onClickFun={handleOnClickNewColumn}
      />
    </>
  );
}
