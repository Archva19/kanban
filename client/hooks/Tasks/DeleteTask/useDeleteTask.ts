import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";

function useDeleteTask() {
  const { handleEditBoard } = useUser();
  async function handleDeleteTask(boardId: string, taskId: string) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${boardId}/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const editedBoard = res.data.data;
      handleEditBoard(editedBoard);
      return editedBoard;
    } catch (error) {
      console.log("failed to edit board", error);
    }
  }

  return {handleDeleteTask}
}


export default useDeleteTask;