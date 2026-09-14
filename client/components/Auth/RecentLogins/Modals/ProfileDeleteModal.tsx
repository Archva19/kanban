import { Drawer } from "vaul";
import { X } from "lucide-react";
import { useRecentLogins } from "@/context/RecentLoginsContext";
import { getRecentLogins, removeRecentUser } from "@/utils/recentLogins";
import { useTranslations } from "next-intl";

export default function ProfileDeleteModal({
  profileDeleteModalVis,
  setProfileDeleteModalVis,
}: {
  profileDeleteModalVis: boolean;
  setProfileDeleteModalVis: (open: boolean) => void;
}) {
  const { recentUsers, setRecentUsers } = useRecentLogins();

  function handleOnClickRemove() {
    setProfileDeleteModalVis(false);
    removeRecentUser(recentUsers[0].email);
    setRecentUsers!(getRecentLogins());
  }
  const t = useTranslations("RecentLogins");

  return (
    <Drawer.Root
      open={profileDeleteModalVis}
      onOpenChange={setProfileDeleteModalVis}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="formBg" />

        <Drawer.Content className="cardBgColor border-t borderLineColor fixed bottom-0 left-0 right-0 w-full z-100 flex flex-col rounded-t-3xl outline-none p-6 shadow-2xl">
          <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-[#828FA3]/40 mb-6 cursor-grab active:cursor-grabbing" />
          <div className="relative flex items-center justify-center mb-6">
            <button
              type="button"
              onClick={() => setProfileDeleteModalVis(false)}
              className="absolute left-0 text-[#828FA3] hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <Drawer.Title className="text-lg font-semibold tracking-wide">
              {t("profiles")}
            </Drawer.Title>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={handleOnClickRemove}
              className="w-full px-4 py-3 rounded-xl border borderLineColor bodyBg text-[#EA5555] font-medium text-left"
            >
               {t("removeProfile")}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
