import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";

function useAddBoard() {
  const { addBoard } = useUser();

  async function createBoard(data: any) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.post("http://localhost:3030/boards", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newBoard = res.data.data;

      addBoard(newBoard);
      return newBoard;
    } catch (error: any) {
      console.log("failed to create board", error);
      return null;
    }
  }

  return { createBoard };
}

export default useAddBoard;
