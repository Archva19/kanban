"use client";

import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";

function useManageInvitations() {
  const { addBoard } = useUser();

  async function acceptInvitation(invitationId: string) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/invitations/${invitationId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const newBoard = res.data.data;
      addBoard(newBoard);
      return newBoard;
    } catch (error) {
      console.error("Failed to accept invitation", error);
      throw error;
    }
  }

  async function rejectInvitation(invitationId: string) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/invitations/${invitationId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      console.error("Failed to reject invitation", error);
      throw error;
    }
  }

  return { acceptInvitation, rejectInvitation };
}

export default useManageInvitations;
