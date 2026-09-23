import { AddCollaboratorPayload } from "@/types/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import { useState } from "react";

function useInviteCollaborator() {
  const [serverError, setServerError] = useState<null | string>(null);
  const [successMessage, setSuccessMessage] = useState<null | string>(null);
  const t = useTranslations("InviteCollaborator");

  async function inviteCollaborator(id: string, data: AddCollaboratorPayload) {
    try {
      setServerError(null);
      setSuccessMessage(null);
      const token = getCookie("accesstoken");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/boards/${id}/collaborators`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status === 200) {
        setSuccessMessage(t("successMessage"));
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        const backendMessage = error.response.data.message;

        if (
          backendMessage ===
          "Board not found or only owner can add collaborators"
        ) {
          setServerError(t("onlyOwner"));
        } else if (backendMessage === "User with this email not found") {
          setServerError(t("notFound"));
        } else if (
          backendMessage === "You are already the owner of this board"
        ) {
          setServerError(t("alreadyOwner"));
        } else if (backendMessage === "User is already a collaborator") {
          setServerError(t("alreadyCollaborator"));
        } else if (
          backendMessage === "Invitation has already been sent to this user"
        ) {
          setServerError(t("alreadySent"));
        } else {
          setServerError(t("serverError"));
        }
      } else {
        setServerError(t("serverError"));
      }
    }
  }

  return { inviteCollaborator, serverError, successMessage };
}

export default useInviteCollaborator;
