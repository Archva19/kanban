"use client";

import { Invitation } from "@/types/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

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

    const interval = setInterval(fetchInvitations, 15000);

    return () => clearInterval(interval);
  }, []);

  return { invitations, setInvitations, loading };
}

export default useFetchInvitations;
