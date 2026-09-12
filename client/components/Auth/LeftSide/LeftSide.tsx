import { useTranslations } from "next-intl";
import AuthLogo from "../Items/AuthLogo";
import RecentLogins from "../RecentLogins/RecentLogins";
import { useRecentLogins } from "@/context/RecentLoginsContext";

export default function LeftSide() {
  const t = useTranslations("AuthTxts");
  const {recentUsers} = useRecentLogins();
  return (
    <>
      <div className={`flex flex-col items-start gap-5 text-center w-auto`}>
        <AuthLogo />
        {recentUsers.length !== 0 && <RecentLogins />}
      </div>
    </>
  );
}
