import { useRecentLogins } from "@/context/RecentLoginsContext";
import { RecentUser } from "@/types/auth";
import { getRecentLogins, removeRecentUser } from "@/utils/recentLogins";
import { X } from "lucide-react";

export default function RecentLoginCard({ user }: { user: RecentUser }) {
  const { setRecentUsers, setSelectedUser } = useRecentLogins();

  const handleRemove = (e: React.MouseEvent, email: string) => {
    e.stopPropagation();
    removeRecentUser(email);
    setRecentUsers!(getRecentLogins());
  };

  return (
    <>
      <div
        onClick={() => setSelectedUser(user)}
        className="cursor-pointer group rounded-xl flex flex-col items-center cardBgColor border borderLineColor hover:border-[#635FC7] hover:scale-103 hover:shadow-xl transition-all relative max-w-35"
      >
        <img
          className="w-35 h-35 rounded-tr-xl rounded-tl-xl object-cover"
          src={user.avatar}
          alt=""
        />
        <div className="flex flex-col items-center justify-center gap-1 text-center p-3 flex-1 w-full">
          <p className="text-sm group-hover:text-[#635FC7] transition-colors truncate max-w-full">
            {user.fullName}
          </p>
          <p className="text-xs text-[#828FA3] font-medium truncate">
            {user.email}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => handleRemove(e, user.email)}
          className="bg-[#828FA3] text-[white] hover:text-[#EA5555] p-1 rounded-full hover:bg-[#EA5555]/30 transition-colors absolute top-2 right-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
