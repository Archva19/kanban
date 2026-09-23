import useFetchInvitations from "@/hooks/Collaborators/FetchInvitations/useFetchInvitations";
import useManageInvitations from "@/hooks/Collaborators/ManageInvitations/useManageInvitations";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function InvitationsDropDown({
  setInvitationsDropDownVis,
}: {
  setInvitationsDropDownVis: (value: boolean) => void;
}) {
  const { invitations, setInvitations, loading } = useFetchInvitations();
  const { acceptInvitation, rejectInvitation } = useManageInvitations();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const t = useTranslations("InvitationsDropDown");
  const loadingT = useTranslations("Loading");

  const handleAccept = async (invitationId: string) => {
    try {
      setActionLoadingId(invitationId);
      await acceptInvitation(invitationId);
      setInvitations((prev) =>
        prev.filter((item) => item._id !== invitationId),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setInvitationsDropDownVis(false);
      setActionLoadingId(null);
    }
  };

  const handleReject = async (invitationId: string) => {
    try {
      setActionLoadingId(invitationId);
      await rejectInvitation(invitationId);
      setInvitations((prev) =>
        prev.filter((item) => item._id !== invitationId),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        onClick={() => setInvitationsDropDownVis(false)}
        className="absolute h-screen w-full top-0 left-0 mt-16 md:mt-20 xl:mt-24 z-50"
      >
        <motion.div
          initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            transition: { duration: 0.25, ease: "easeInOut" },
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()}
          className="w-full absolute left-0 cardBgColor flex flex-col gap-5 border-b borderLineColor shadow-2xl px-4 py-4 md:px-6 xl:px-8 "
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">{t("invites")}</h3>
            <span className="bg-[#635FC7]/10 text-[#635FC7] text-xs font-bold px-2.5 py-1 rounded-full">
              {invitations.length}
            </span>
          </div>
          {loading ? (
            <div className="pb-6 text-center text-sm font-medium text-[#828FA3]">
              {loadingT("loading")}
            </div>
          ) : invitations.length === 0 ? (
            <div className="pb-6 text-center">
              <p className="text-sm font-medium text-[#828FA3]">
                {t("noInvites")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {invitations.map((inv) => {
                const isProcessing = actionLoadingId === inv._id;
                return (
                  <div key={inv._id} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      {inv.sender.profilePicture && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                          <img
                            src={inv.sender.profilePicture}
                            alt={inv.sender.fullName || "User"}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col text-xs leading-tight">
                        <span>{inv.sender.fullName}</span>
                        <span className="text-[#828FA3] text-[11px] truncate max-w-45">
                          {inv.sender.email}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs flex items-center">
                      <p className="text-[#828FA3] font-medium">
                        {t("isInviting")}{" "}
                      </p>
                      <span>&ldquo;{inv.board.title}&rdquo;</span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        disabled={isProcessing}
                        onClick={() => handleAccept(inv._id)}
                        className="flex-1 formBtn purpleBtn leading-[100%]! text-xs!"
                      >
                        {isProcessing ? loadingT("processing") : t("accept")}
                      </button>
                      <button
                        disabled={isProcessing}
                        onClick={() => handleReject(inv._id)}
                        className="flex-1 formBtn leading-[100%]! text-xs! bg-[#EA5555]/10 hover:bg-[#EA5555]/20 disabled:opacity-50 text-[#EA5555]"
                      >
                        {isProcessing ? loadingT("processing") : t("reject")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
