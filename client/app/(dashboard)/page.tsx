"use client";
import GetStarted from "@/components/GetStarted/GetStarted";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { userData, boards } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userData) {
      if (boards && boards.length > 0) {
        router.push(`/boards/${boards[0]._id}`);
      }
    }
  }, [userData, router]);

  if (!userData) return null;

  if (userData.boards?.length === 0) {
    return <GetStarted />;
  }

  return null;
}
