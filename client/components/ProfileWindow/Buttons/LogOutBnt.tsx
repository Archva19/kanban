import { useRecentLogins } from "@/context/RecentLoginsContext";
import { getRecentLogins } from "@/utils/recentLogins";
import { deleteCookie } from "cookies-next";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function LogOutBnt() {
  const t = useTranslations("ProfileWindow");
  const router = useRouter();
  const { setRecentUsers } = useRecentLogins();

  function handleLogOut() {
    deleteCookie("accesstoken");
    router.refresh();
    setRecentUsers(getRecentLogins());
  }

  return (
    <button
      onClick={handleLogOut}
      className="flex items-center gap-2 text-[#EA5555] hover:text-[#EA5555]/70 transition-all duration-200 font-medium text-sm"
    >
      <LogOut className="w-5 h-5 shrink-0" />
      <span>{t("logOut")}</span>
    </button>
  );
}
