import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";

function useAssignTask() {
  const { handleEditBoard } = useUser();
  async function handleAssignTask(
    boardId: string,
    taskId: string,
    assigneeId: string | null,
  ) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${boardId}/${taskId}/assignee`,
        { assignee: assigneeId },
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
      console.log("failed to assign task", error);
    }
  }

  return { handleAssignTask };
}

export default useAssignTask;
