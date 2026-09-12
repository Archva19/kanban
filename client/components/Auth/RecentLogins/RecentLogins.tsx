import RecentLoginCard from "./RecentLoginCard";
import RecentLoginModal from "./RecentLoginModal";
import { AnimatePresence } from "motion/react";
import { useRecentLogins } from "@/context/RecentLoginsContext";
import { useTranslations } from "next-intl";

export default function AuthPage() {
  const { recentUsers, setRecentUsers, selectedUser, setSelectedUser } =
    useRecentLogins();
  const t = useTranslations("RecentLogins");

  return (
    <>
      {recentUsers!.length > 0 && (
        <div>
          <div className="hidden flex-col items-start gap-3 xl:flex">
            <p className="text-sm font-semibold text-[#828FA3] uppercase tracking-wider">
              {t("title")}
            </p>
            <div className="flex gap-4 flex-wrap">
              {recentUsers!.map((user) => (
                <RecentLoginCard key={user.email} user={user} />
              ))}
            </div>
          </div>
          <AnimatePresence>
            {selectedUser && <RecentLoginModal />}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
