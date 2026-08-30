"use client";

import { useUser } from "@/context/UserContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Board({}) {
  const { boards, userData } = useUser();
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (userData && boards && boards.length === 0) {
      router.push("/");
    }
  }, [boards, userData, router]); // 👈 დაემატა boards და userData

  const activeBoard = boards?.find((board) => board._id === id);

  if (!userData || boards.length === 0) return null;

  return (
    <>
      <div>
        
      </div>
    </>
  );
}
