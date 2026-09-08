import { useForms } from "@/context/FormsContext";
import EmptyMessageModel from "../models/Messages/EmptyMessageModel";
import { useTranslations } from "next-intl";

export default function GetStarted() {
  const { setNewBoardVis } = useForms();

  function handleOnClick() {
    setNewBoardVis(true);
  }

  const t = useTranslations("GetStarted");
  return (
    <>
      <EmptyMessageModel
        title={t("message")}
        btnTxt={t("btnTxt")}
        onClickFun={handleOnClick}
      />
    </>
  );
}
