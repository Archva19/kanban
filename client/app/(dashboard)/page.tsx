"use client";
import GetStarted from "@/components/GetStarted/GetStarted";
import useFetchUser from "@/hooks/FetchUser/useFetchUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const userData = useFetchUser();
  const router = useRouter();

  useEffect(() => {
    if (userData) {
      if (userData.boards && userData.boards.length > 0) {
        router.push(`/boards/${userData.boards[0]._id}`);
      }
    }
  }, [userData, router]);

  if (!userData) return null;

  if (userData.boards?.length === 0) {
    return <GetStarted />;
  }

  return null;
}
