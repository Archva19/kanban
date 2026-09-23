import { useUser } from "@/context/UserContext";
import { EditBoardPayload } from "@/types/types";
import axios from "axios";
import { getCookie } from "cookies-next";

function useEditBoard() {
  const { handleEditBoard } = useUser();

  async function editBoard(id: string, data:EditBoardPayload) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/boards/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const editedBoard = res.data.data;
      handleEditBoard(editedBoard);
      return editedBoard;
    } catch (error) {
      console.log("failed to edit board", error);
    }
  }

  return { editBoard };
}

export default useEditBoard;
