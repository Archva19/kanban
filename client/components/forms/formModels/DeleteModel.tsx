import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";

interface DeleteModelProps {
  windowType: string;
  windowVisState: (value: boolean) => void;
  title: string;
  handleOnDelete: () => void;
}

export default function DeleteModel({
  windowType,
  windowVisState,
  title,
  handleOnDelete,
}: DeleteModelProps) {

  const locale = useLocale();
  const t = useTranslations("DeleteForm");

  return (
    <>
      <div className="formBg" onClick={() => windowVisState(false)}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="cardBgColor formWindow md:pb-10"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="formTitle text-[#EA5555]">{windowType === "board" ? t("deleteBoardQuest") : t("deleteTaskQuest")}</p>
          <p className="text-[13px] leading-5.75! text-[#828FA3] font-medium">
            {windowType === "board"
              ? (locale === "en" ? `Are you sure you want to delete the ‘${title}’ board? This action will remove all columns and tasks and cannot be reversed.` : `ნამდვილად გსურთ დაფის ‘${title}’ წაშლა? ეს წაშლის ყველა სვეტსა და დავალებას და ამ მოქმედების უკან დაბრუნება შეუძლებელია.`)
              : (locale === "en" ? `Are you sure you want to delete the ‘${title}’ task and its subtasks? This action cannot be reversed.` : `ნამდვილად გსურთ დავალების ‘${title}’ და მისი ქვედავალებების წაშლა? ამ მოქმედების უკან დაბრუნება შეუძლებელია.`)}
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
      </div>
    </>
  );
}
