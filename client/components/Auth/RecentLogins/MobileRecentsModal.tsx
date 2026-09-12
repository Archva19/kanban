import { Drawer } from "vaul";
import { Trash2, X } from "lucide-react";
import { useRecentLogins } from "@/context/RecentLoginsContext";
import { getRecentLogins, removeRecentUser } from "@/utils/recentLogins";
import { RecentUser } from "@/types/auth";

export default function MobileRecentsModal({
  mobileRecentsModalVis,
  setMobileRecentsModalVis,
}: {
  mobileRecentsModalVis: boolean;
  setMobileRecentsModalVis: (open: boolean) => void;
}) {
  const { recentUsers, setRecentUsers, selectedUser, setSelectedUser } =
    useRecentLogins();

  function handleSelectProfile(user: RecentUser) {
    setMobileRecentsModalVis(false);
    setSelectedUser(user);
  }

  function handleRemoveUser(e: React.MouseEvent, email: string) {
    e.stopPropagation();
    removeRecentUser(email);
    setRecentUsers(getRecentLogins());
  }

  return (
    <Drawer.Root
      open={mobileRecentsModalVis}
      onOpenChange={setMobileRecentsModalVis}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="formBg" />

        <Drawer.Content className="cardBgColor border-t borderLineColor fixed bottom-0 left-0 right-0 w-full z-100 flex flex-col rounded-t-3xl outline-none p-6 shadow-2xl">
          <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-[#828FA3]/40 mb-6 cursor-grab active:cursor-grabbing" />

          <div className="relative flex items-center justify-center mb-6">
            <button
              type="button"
              onClick={() => setMobileRecentsModalVis(false)}
              className="absolute left-0 text-[#828FA3] hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <Drawer.Title className="text-lg font-semibold tracking-wide">
              Profiles
            </Drawer.Title>
          </div>

          <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-[60vh] pr-1">
            {recentUsers?.map((user) => {
              const isSelected = selectedUser?.email === user.email;

              return (
                <div
                  key={user.email}
                  onClick={() => handleSelectProfile(user)}
                  className="w-full p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group bodyBg borderLineColor hover:border-[#635FC7]/60"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border borderLineColor"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate w-full group-hover:text-[#635FC7] transition-colors">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-[#828FA3] truncate w-full">
                        {user.email}
                      </p>
                    </div>
                  </div>


                  <button
                    onClick={(e) => handleRemoveUser(e, user.email)}
                    className="p-2 rounded-lg text-[#828FA3]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              );
            })}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
