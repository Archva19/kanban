import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";

function useEditTask() {
  const { handleEditBoard } = useUser();

  async function handleEditTask(boardId: string, taskId: string, data: any) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.put(
        `http://localhost:3030/tasks/${boardId}/${taskId}`,
        data,
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
      console.log("failed to edit task", error);
    }
  }

  return { handleEditTask };
}

export default useEditTask;
