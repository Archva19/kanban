import { Board, BoardUser } from "@/types/types";
import MemberItemModel from "./MemberItemModel";
import { useTranslations } from "next-intl";
import useRemoveCollaborator from "@/hooks/Collaborators/RemoveCollaborator/useRemoveCollaborator";
import { useCurrentOwner } from "@/context/IsCurrentOwnerContext";

export default function Members({ activeBoard }: { activeBoard?: Board }) {
  const t = useTranslations("InviteCollaborator");
  const { removeCollaborator, loadingId } = useRemoveCollaborator();

  const {isCurrentOwner} = useCurrentOwner();

  const handleRemove = (collaboratorId: string) => {
    if (!activeBoard?._id) return;
    removeCollaborator(activeBoard._id, collaboratorId);
  };

  return (
    <>
      <div className="flex flex-col gap-3 ">
        <div className="flex flex-col gap-2">
          <p className="inputTitle">
            {t("owner")} {isCurrentOwner && "(You)"}
          </p>
          <MemberItemModel user={activeBoard?.owner} status="owner" />
        </div>
        {activeBoard?.collaborators &&
          activeBoard?.collaborators.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="inputTitle">{t("collaborators")}</p>
              <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                {activeBoard?.collaborators.map((collab: BoardUser) => (
                  <MemberItemModel
                    key={collab._id}
                    user={collab}
                    status="collaborator"
                    isCurrentOwner={isCurrentOwner}
                    isRemoving={loadingId === collab._id}
                    onRemove={() => handleRemove(collab._id)}
                  />
                ))}
              </div>
            </div>
          )}
      </div>
    </>
  );
}
