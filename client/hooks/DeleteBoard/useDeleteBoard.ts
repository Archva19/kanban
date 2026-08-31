import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";

function useDeleteBoard() {
  const { handleDeleteBoard } = useUser();

  async function deleteBoard(id:string) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.delete(`http://localhost:3030/boards/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const deletedBoard = res.data.data;
      handleDeleteBoard(deletedBoard._id);
      return true;
    } catch (error) {
      console.log("failed to delete board", error);
      return false;
    }
  }

  return { deleteBoard };
}

export default useDeleteBoard;