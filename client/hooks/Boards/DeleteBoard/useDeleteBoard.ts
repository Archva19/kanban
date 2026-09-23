import { useForms } from "@/context/FormsContext";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

function useDeleteBoard() {
  const { handleDeleteBoard } = useUser();
  const { setDeleteBoardVis, setDeleteMessageVis } = useForms();
  const router = useRouter();
  const { boards } = useUser();
  const t = useTranslations("DeleteForm");

  async function deleteBoard(id: string, startTimer: () => void) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/boards/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status === 200) {
        const deletedBoard = res.data.data;
        handleDeleteBoard(deletedBoard._id);
        setDeleteBoardVis(false);
        setDeleteMessageVis(true);
        startTimer();

        const remainingBoards = boards.filter((b) => b._id !== id);

        if (remainingBoards.length > 0) {
          router.push(`/boards/${remainingBoards[0]._id}`);
        } else {
          router.push("/");
        }
      }
      return true;
    } catch (error) {
      console.log("failed to delete board", error);
      return false;
    }
  }

  return { deleteBoard };
}

export default useDeleteBoard;
