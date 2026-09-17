import { useTranslations } from "next-intl";
import AuthLogo from "../Items/AuthLogo";
import RecentLogins from "../RecentLogins/RecentLogins/RecentLogins";
import { useRecentLogins } from "@/context/RecentLoginsContext";
import { usePathname } from "next/navigation";

export default function LeftSide() {
  const t = useTranslations("AuthTxts");
  const { recentUsers } = useRecentLogins();
  const pathname = usePathname();

  const allowedRoutes = ["/sign-in", "/sign-up", "/verify-email"];
  const shouldShowRecentLogins = allowedRoutes.some((route) =>
    pathname.includes(route),
  );
  return (
    <>
      <div className={`flex flex-col items-start md:gap-5 text-center w-auto`}>
        <AuthLogo />
        {recentUsers.length !== 0 && shouldShowRecentLogins && <RecentLogins />}
      </div>
    </>
  );
}
