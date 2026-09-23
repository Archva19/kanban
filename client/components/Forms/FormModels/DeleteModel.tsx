import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "use-intl";

interface DeleteModelProps {
  windowType: string;
  windowVisState: (value: boolean) => void;
  title: string | undefined;
  handleOnDelete: () => void;
}

export default function DeleteModel({
  windowType,
  windowVisState,
  title,
  handleOnDelete,
}: DeleteModelProps) {
  const t = useTranslations("DeleteForm");
  const [savedTitle] = useState(title);
  const displayTitle = title || savedTitle || "";

  return (
    <>
      <motion.div
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        className="formBg"
        onClick={() => windowVisState(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="cardBgColor formWindow md:pb-10"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="formTitle text-[#EA5555]">
            {windowType === "board"
              ? t("deleteBoardQuest")
              : t("deleteTaskQuest")}
          </p>
          <p className="text-[13px] leading-5.75! text-[#828FA3] font-medium wrap-break-word">
            {windowType === "board"
              ? t("deleteBoardConfirm", { title: displayTitle })
              : t("deleteTaskConfirm", { title: displayTitle })}
          </p>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <button className="formBtn redBtn" onClick={handleOnDelete}>
                {t("delete")}
              </button>
            </div>
            <div className="flex-1">
              <button
                className="formBtn lightPurpleBtn"
                onClick={() => windowVisState(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
