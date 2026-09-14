import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const languages = [
  { code: "en", label: "EN" },
  { code: "ka", label: "KA" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    if (locale === newLocale) return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <div className="relative flex items-center h-7 p-0.5 rounded-full cardBgColor border borderLineColor select-none">
      {languages.map((lang) => {
        const isActive = locale === lang.code;

        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`relative z-10 px-2 py-0.5 text-[10px] md:text-[11px] font-bold transition-colors duration-200 cursor-pointer ${
              isActive
                ? "text-white"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeLanguagePill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 z-[-1] rounded-full bg-[#635FC7] shadow-xs shadow-[#635FC7]/40"
              />
            )}
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}

//  <div className="flex items-center">
//         <button
//           onClick={() => handleLanguageChange("en")}
//           className={`inline-block rounded-tl-xl rounded-bl-xl pl-2 pr-1.5 py-1 font-medium border-t border-b border-l text-xs ${
//             locale === "en"
//               ? "bg-[#635FC7] text-white border-transparent"
//               : "text-[#828fa3] hover:bg-[#635FC7]/10 border-[#828fa3]"
//           }`}
//         >
//           EN
//         </button>
//         <button
//           onClick={() => handleLanguageChange("ka")}
//           className={`inline-block rounded-tr-xl rounded-br-xl pr-2 pl-1.5 py-1 font-medium border-t border-b border-r text-xs ${
//             locale === "ka"
//               ? "bg-[#635FC7] text-white border-transparent"
//               : "text-[#828FA3] hover:bg-[#635FC7]/10 border-[#828fa3]"
//           }`}
//         >
//           KA
//         </button>
//       </div>
