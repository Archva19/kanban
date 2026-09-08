import { UserCircle } from "lucide-react";
import LogOutBnt from "../Buttons/LogOutBnt";
import { useUser } from "@/context/UserContext";
import { useTranslations } from "next-intl";

export default function Menu() {
  const { userData } = useUser();
  const t = useTranslations("ProfileWindow");
  return (
    <div className="bodyBg flex flex-col items-start gap-2 w-full h-full absolute top-0 left-0 px-3 pt-15 rounded-2xl text-medium md:static md:w-auto md:p-4 md:rounded-br-none md:rounded-tr-none">
      <button className="group w-full flex items-center gap-2 text-left justify-start md:w-35 lg:w-50 cardBgColor hover:bg-[#635FC7]/10 border border-transparent hover:border-[#635FC7]/30 p-2.5 rounded-lg transition-all duration-200 cursor-pointer">
        <UserCircle className="w-5 h-5 text-[#635FC7] shrink-0" />
        <p className="font-medium text-sm group-hover:text-[#635FC7] transition-colors">
          {t("profile")}
        </p>
      </button>
      {!userData?.isGuest && <LogOutBnt />}
      {userData?.isGuest && (
        <div className="px-2.5 py-1.5 bg-[#635FC7]/10 text-[#635FC7] rounded-lg text-xs font-medium text-center w-full md:w-35 lg:w-50">
          Guest Access
        </div>
      )}
    </div>
  );
}
