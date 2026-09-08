import { deleteCookie } from "cookies-next";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function LogOutBnt() {
  const t = useTranslations("ProfileWindow");
  const router = useRouter();

  function handleLogOut() {
    deleteCookie("accesstoken");
    router.refresh();
  }
  return (
    <button
      onClick={handleLogOut}
      className="cardBgColor flex items-center gap-2 text-[#EA5555] hover:bg-[#EA5555]/20  border border-transparent hover:border-[#EA5555]/30 transition-all duration-200 p-2.5 w-full md:w-35 lg:w-50 rounded-lg font-medium text-sm"
    >
      <LogOut className="w-5 h-5 shrink-0" />
      <span>{t("logOut")}</span>
    </button>
  );
}
