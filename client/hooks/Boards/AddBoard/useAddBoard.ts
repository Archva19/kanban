import { useUser } from "@/context/UserContext";
import { CreateBoardPayload } from "@/types/types";
import axios from "axios";
import { getCookie } from "cookies-next";

function useAddBoard() {
  const { addBoard } = useUser();

  async function createBoard(data: CreateBoardPayload) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/boards`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newBoard = res.data.data;

      addBoard(newBoard);
      return newBoard;
    } catch (error) {
      console.log("failed to create board", error);
      return null;
    }
  }

  return { createBoard };
}

export default useAddBoard;
