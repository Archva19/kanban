import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";

function useEditBoard() {
  const { handleEditBoard } = useUser();

  async function editBoard(id: string, data: any) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.put(`http://localhost:3030/boards/${id}`, data, {
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
