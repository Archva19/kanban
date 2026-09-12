import { useUser } from "@/context/UserContext";

export default function HeaderProfileBtn({
  setProfileWindowVis,
}: {
  setProfileWindowVis: (value: boolean) => void;
}) {
  const { userData } = useUser();

  if (!userData?.profilePicture) return null;

  return (
    <button
      type="button"
      onClick={() => setProfileWindowVis(true)}
      className="relative shrink-0 rounded-full cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-[#635FC7]"
      aria-label="Open profile window"
    >
      <img
        src={userData.profilePicture}
        alt={userData.fullName || "User Profile"}
        className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border borderLineColor ring-2 ring-transparent group-hover:ring-[#635FC7]/60 group-active:scale-95 transition-all duration-200"
      />
    </button>
  );
}