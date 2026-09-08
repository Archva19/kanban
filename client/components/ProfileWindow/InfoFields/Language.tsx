import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import PurpleChevronDown from "@/components/models/Icons/PurpleChevronDown";

export default function Language() {
  const t = useTranslations("ProfileWindow");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)} className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-[#828FA3]">
          {t("language")}
        </span>
        <div className="cursor-pointer relative flex items-center justify-between gap-3 bodyBg border borderLineColor rounded-lg py-3 px-4 w-full">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-[#635FC7] shrink-0 pointer-events-none z-10" />
            <p className="font-medium text-sm truncate">
              {locale === "en" ? "English" : "ქართული"}
            </p>
          </div>
          <motion.div
            initial={{ rotate: -45 }}
            animate={{ rotate: isOpen ? -225 : -45 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <PurpleChevronDown />
          </motion.div>

          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="modifyDropDown absolute w-full left-0 top-13"
            >
              <button
                onClick={() => handleLanguageChange("en")}
                className="w-full flex items-start"
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange("ka")}
                className="w-full flex items-start"
              >
                ქართული
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
