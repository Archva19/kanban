import { useUser } from "@/context/UserContext";
import { BoardUser } from "@/types/types";
import { Trash2, User, UserStar } from "lucide-react";

interface MemberItemModelProps {
  user?: BoardUser;
  status: "owner" | "collaborator";
  isCurrentOwner?: boolean;
  onRemove?: () => void;
  isRemoving?: boolean;
}

export default function MemberItemModel({
  user,
  status,
  isCurrentOwner,
  onRemove,
  isRemoving,
}: MemberItemModelProps) {
  const { userData } = useUser();

  return (
    <>
      <div className="flex bodyBg items-center justify-between gap-3 w-full py-3.5 pl-4 pr-5 rounded-md text-left  transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <img
              className="w-9 h-9 rounded-full object-cover"
              src={user?.profilePicture}
              alt={user?.fullName || "User profile"}
            />
          </div>

          <div className="flex flex-col min-w-0 w-full flex-1 max-w-full">
            <p className="text-[15px] font-semibold group-hover:text-[#635fc7] truncate">
              {user?.fullName || "User"}{" "}
              {userData?._id === user?._id && "(You)"}
            </p>
            <p className="text-[12px] text-[#828fa3] truncate">{user?.email}</p>
          </div>
        </div>
        {status === "owner" ? (
          <div className="text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]">
            <UserStar className="w-5 h-5" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="text-[#635FC7] bg-[#635FC7]/10 p-1.5 rounded-full shrink-0">
              <User className="w-4 h-4" />
            </div>
            {isCurrentOwner && (
              <button
                disabled={isRemoving}
                onClick={onRemove}
                className="text-[#828FA3] hover:text-[#EA5555] p-1.5 rounded-full hover:bg-[#EA5555]/10 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
