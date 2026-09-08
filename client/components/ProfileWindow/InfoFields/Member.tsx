import { useUser } from "@/context/UserContext";
import { Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Member() {
  const t = useTranslations("ProfileWindow");
  const { userData } = useUser();
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-[#828FA3]">
          {t("member")}
        </span>
        <div className="flex items-center gap-3 bodyBg border borderLineColor rounded-lg py-3 px-4 w-full">
          <Calendar className="w-4 h-4 text-[#635FC7] shrink-0" />
          <p className="font-medium text-sm">
            {userData?.createdAt
              ? new Date(userData.createdAt).toLocaleDateString()
              : "Recently"}
          </p>
        </div>
      </div>
    </>
  );
}
