import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import { useEffect, useState } from "react";

const languages = [
  { code: "en", label: "EN" },
  { code: "ka", label: "KA" },
];

interface LanguageSwitcherProps {
  layoutId?: string;
}

export default function LanguageSwitcher({
  layoutId = "activeLanguagePill",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    if (locale === newLocale) return;
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  if (!mounted) {
    return (
      <div className="flex items-center h-7 p-0.5 rounded-full cardBgColor border borderLineColor select-none opacity-0">
        <span className="px-2 py-0.5 text-[10px] md:text-[11px] font-bold">
          EN
        </span>
        <span className="px-2 py-0.5 text-[10px] md:text-[11px] font-bold">
          KA
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center h-7 p-0.5 rounded-full cardBgColor border borderLineColor select-none">
      {languages.map((lang) => {
        const isActive = locale === lang.code;

        return (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`relative z-10 px-2 py-0.5 text-[10px] md:text-[11px] font-bold transition-colors duration-200 cursor-pointer ${
              isActive ? "text-white" : "opacity-60 hover:opacity-100"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                layoutDependency={locale}
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
