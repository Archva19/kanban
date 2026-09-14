import { useUser } from "@/context/UserContext";
import { EditTaskPayload } from "@/types/types";
import axios from "axios";
import { getCookie } from "cookies-next";

function useEditTask() {
  const { handleEditBoard } = useUser();

  async function handleEditTask(boardId: string, taskId: string, data:EditTaskPayload) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${boardId}/${taskId}`,
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
