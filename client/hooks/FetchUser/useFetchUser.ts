"use client";

import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

function useFetchUser(url: string = "http://localhost:3030/users/me") {
  const [userData, setUserdata] = useState<any>(null);

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
      } catch (error) {
        console.log("failed to fetch user data", error);
      }
    }

    fetchUser();
  }, [url]);

  return userData;
}

export default useFetchUser;
