import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center">
        <button
          onClick={() => handleLanguageChange("en")}
          className={`inline-block rounded-tl-xl rounded-bl-xl pl-2 pr-1.5 py-1 font-medium border-t border-b border-l text-xs ${
            locale === "en"
              ? "bg-[#635FC7] text-white border-transparent"
              : "text-[#828fa3] hover:bg-[#635FC7]/10 border-[#828fa3]"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange("ka")}
          className={`inline-block rounded-tr-xl rounded-br-xl pr-2 pl-1.5 py-1 font-medium border-t border-b border-r text-xs ${
            locale === "ka"
              ? "bg-[#635FC7] text-white border-transparent"
              : "text-[#828FA3] hover:bg-[#635FC7]/10 border-[#828fa3]"
          }`}
        >
          KA
        </button>
      </div>
    </>
  );
}
