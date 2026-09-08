import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ModifyDropDownModelProps {
  subject: string;
  stopTimer: () => void;
  startTimer: () => void;
  handleOnClickEdit: () => void;
  handleOnClickDelete: () => void;
}

export default function ModifyDropDownModel({
  subject,
  stopTimer,
  startTimer,
  handleOnClickEdit,
  handleOnClickDelete,
}: ModifyDropDownModelProps) {
  const t = useTranslations("ModifyDropDown");
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
        className="modifyDropDown"
      >
        <button
          onClick={handleOnClickEdit}
          className="min-w-40 text-left text-[#828FA3]"
        >
          {subject === "Board" ? t("editBoard") : t("editTask")}
        </button>
        <button
          onClick={handleOnClickDelete}
          className="min-w-40 text-left text-[#EA5555]"
        >
          {subject === "Board" ? t("deleteBoard") : t("deleteTask")}
        </button>
      </motion.div>
    </>
  );
}
