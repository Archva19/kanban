"use client";

import { User } from "@/types/types";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useFetchUser(url: string = "http://localhost:3030/users/me") {
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = getCookie("accesstoken");
        if (!token) return;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(res.data.data);
      } catch (error: unknown) {
        console.log("failed to fetch user data", error);
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 404 || status === 401) {
            deleteCookie("accesstoken");
            setUserData(null);
            router.push("/sign-in");
            router.refresh();
          }
        }
      }
    }

    fetchUser();
    const interval = setInterval(() => {
      fetchUser();
    }, 15000);

    return () => clearInterval(interval);
  }, [url, router]);

  return { userData, setUserData };
}

export default useFetchUser;
