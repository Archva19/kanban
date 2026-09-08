import { LogIn, Mail, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function GuestJoinBtns() {
  const t = useTranslations("ProfileWindow");
  return (
    <>
      <div className="p-4 rounded-xl bg-[#635FC7]/5 border border-[#635FC7]/20 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#635FC7]">
          <Mail className="w-4 h-4" />
          <span>
            {t("guestMessage")}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <Link
            href="/sign-in"
            className="flex-1 flex items-center justify-center gap-2 bg-[#635FC7] hover:bg-[#A8A4CE] text-white py-2.5 px-4 rounded-full text-xs font-semibold transition-all duration-200"
          >
            <LogIn className="w-3.5 h-3.5" />
             {t("signIn")}
          </Link>
          <Link
            href="/sign-up"
            className="flex-1 flex items-center justify-center gap-2 bg-[#635FC7]/10 hover:bg-[#635FC7]/20 text-[#635FC7] dark:text-white py-2.5 px-4 rounded-full text-xs font-semibold transition-all duration-200"
          >
            <UserPlus className="w-3.5 h-3.5" />
             {t("createAccount")}
          </Link>
        </div>
      </div>
    </>
  );
}
