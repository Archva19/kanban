import { useUser } from "@/context/UserContext";

interface ProfileBtnProps {
  setProfileWindowVis: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
}

export default function ProfileBtn({
  setProfileWindowVis,
  onClose,
}: ProfileBtnProps) {
  const { userData } = useUser();

  function handleClick() {
    setProfileWindowVis(true);
    if (onClose) onClose();
  }

  return (
    <button
      onClick={handleClick}
      className="flex bodyBg items-center gap-3 w-full py-3.5 px-4 rounded-md hover:bg-[#635FC7]/25 group text-left cursor-pointer transition-colors duration-200"
    >
      <div className="shrink-0">
        <img
          className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-purple-500/30"
          src={userData?.profilePicture || ""}
          alt={userData?.fullName || "User profile"}
        />
      </div>

      <div className="flex flex-col min-w-0 w-full flex-1 max-w-full">
        <p className="text-[15px] font-semibold group-hover:text-[#635fc7] truncate">
          {userData?.fullName || "Loading..."}
        </p>
        <p className="text-[12px] text-[#828fa3] truncate">{userData?.email}</p>
      </div>
    </button>
  );
}
