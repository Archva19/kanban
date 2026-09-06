"use client";

import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useFetchUser(url: string = "http://localhost:3030/users/me") {
  const [userData, setUserdata] = useState<any>(null);
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

        setUserdata(res.data.data);
      } catch (error: any) {
        console.log("failed to fetch user data", error);
        if (error.response?.status === 404 || error.response?.status === 401) {
          deleteCookie("accesstoken");
          setUserdata(null);
          router.push("/sign-in");
          router.refresh();
        }
      }
    }

    fetchUser();
    const interval = setInterval(() => {
      fetchUser();
    }, 15000);

    return () => clearInterval(interval);
  }, [url, router]);

  return userData;
}

export default useFetchUser;
