import { useForms } from "@/context/FormsContext";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";

function useToggleSubtask() {
  const { setActiveTask } = useForms();
  const { handleEditBoard } = useUser();
  async function handleToggleSubtask(
    boardId: string,
    taskId: string,
    subTaskId: string,
  ) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.patch(
        `http://localhost:3030/tasks/${boardId}/${taskId}/subtasks/${subTaskId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const editedBoard = res.data.data;
      handleEditBoard(editedBoard);

      let updatedTask = null;

      for (const column of editedBoard.columns) {
        const found = column.tasks.find((task: any) => task._id === taskId);
        if (found) {
          updatedTask = found;
          break;
        }
      }
      
      if (updatedTask) {
        setActiveTask(updatedTask);
      }

      return editedBoard;
    } catch (error) {
      console.log("failed to edit board", error);
    }
  }

  return { handleToggleSubtask };
}

export default useToggleSubtask;
