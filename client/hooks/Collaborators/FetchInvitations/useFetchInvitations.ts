"use client";

import { Invitation } from "@/types/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";

function useFetchInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvitations() {
      try {
        setLoading(true);
        const token = getCookie("accesstoken");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/invitations/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setInvitations(res.data.data);
      } catch (err: unknown) {
        console.error("failed to fetch invitations", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvitations();
  }, []);

  useEffect(() => {
    const handleNewInvitation = (newInv: Invitation) => {
      setInvitations((prev) => {
        if (prev.some((inv) => inv._id === newInv._id)) return prev;
        return [newInv, ...prev];
      });
    };

    const handleRemoveInvitation = ({
      invitationId,
    }: {
      invitationId: string;
    }) => {
      setInvitations((prev) =>
        prev.filter((item) => item._id !== invitationId),
      );
    };

    socket.on("new_invitation", handleNewInvitation);
    socket.on("invitation_accepted", handleRemoveInvitation);
    socket.on("invitation_rejected", handleRemoveInvitation);

    return () => {
      socket.off("new_invitation", handleNewInvitation);
      socket.off("invitation_accepted", handleRemoveInvitation);
      socket.off("invitation_rejected", handleRemoveInvitation);
    };
  }, []);

  return { invitations, setInvitations, loading };
}

export default useFetchInvitations;
