import { useUser } from "@/context/UserContext";

export default function ProfileBtn() {
  const { userData } = useUser();

  return (
    <button className="flex bodyBg items-center gap-3 w-full py-3.5 px-4 rounded-md hover:bg-[#635FC7]/25 activeBoard.columns duration-200 group text-left cursor-pointer">
      <div className="shrink-0">
        <img
          className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent group-hover:ring-purple-500/30 transition-all"
          src={userData.profilePicture}
          alt={userData.fullName}
        />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-[15px] font-semibold group-hover:text-[#635fc7] transition-colors duration-200">
          {userData.fullName}
        </p>
        <p className="text-[12px] text-[#828fa3]">
          {userData?.email}
        </p>
      </div>
    </button>
  );
}

