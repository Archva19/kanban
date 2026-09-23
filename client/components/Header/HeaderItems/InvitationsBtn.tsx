import useFetchInvitations from "@/hooks/Collaborators/FetchInvitations/useFetchInvitations";
import { Mail } from "lucide-react";

interface InvitationsBtnProps {
  onClick?: () => void;
}

export default function InvitationsBtn({ onClick }: InvitationsBtnProps) {
  const { invitations } = useFetchInvitations();
  const count = invitations.length;
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-[#828FA3] hover:text-[#635FC7] dark:hover:text-white rounded-lg hover:bg-lightBg dark:hover:bg-[#20212C] transition-colors focus:outline-none"
      title="Invitations"
    >
      <Mail className="w-5 h-5 stroke-2" />

      {count > 0 && (
        <span className="absolute top-px -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EA5555] text-[10px] font-bold text-white shadow-sm">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}
