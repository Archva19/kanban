import { useRecentLogins } from "@/context/RecentLoginsContext";
import { useUser } from "@/context/UserContext";
import { getRecentLogins, removeRecentUser } from "@/utils/recentLogins";
import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAccount() {
  const t = useTranslations("ProfileWindow");
  const { userData } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setRecentUsers } = useRecentLogins();

  async function handleDelete() {
    try {
      setIsLoading(true);
      const token = getCookie("accesstoken");
      if (!token) return;

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      deleteCookie("accesstoken");
      router.push("/sign-in");
      if (userData?.email) {
        removeRecentUser(userData.email);
      }
      setRecentUsers(getRecentLogins());
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-[#EA5555]">
          {t("dangerZone")}
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-between gap-3 bodyBg border border-[#EA5555]/40 hover:border-[#EA5555] rounded-lg py-3 px-4 w-full h-11.5 text-[#EA5555] hover:bg-[#EA5555]/20 transition-colors duration-200 group"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-4 h-4 text-[#EA5555] shrink-0" />
            <p className="font-medium text-sm">{t("deleteAccount")}</p>
          </div>
        </button>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bodyBg border borderLineColor rounded-2xl p-6 w-full max-w-md shadow-2xl relative flex flex-col gap-4">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-[#828FA3] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#EA5555]/10 flex items-center justify-center text-[#EA5555]">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-lg">{t("deleteQuest")}</h3>
              <p className="text-xs text-[#828FA3]">{t("deleteDesc")}</p>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                disabled={isLoading}
                onClick={handleDelete}
                className="redBtn flex-1 text-sm py-2.5 rounded-full disabled:opacity-50"
              >
                {isLoading ? t("deleting") : t("delete")}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="lightPurpleBtn flex-1 text-sm py-2.5 rounded-full"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
