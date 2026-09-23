import { useUser } from "@/context/UserContext";
import { CreateTaskPayload} from "@/types/types";
import axios from "axios";
import { getCookie } from "cookies-next";

function useAddTask() {
  const { handleEditBoard } = useUser();

  async function handleCreateTask(id: string, data: CreateTaskPayload) {
    try {
      const token = getCookie("accesstoken");
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const editedBoard = res.data.data;
      handleEditBoard(editedBoard);
      return editedBoard;
    } catch (error) {
      console.log("failed to create task", error);
    }
  }

  return {handleCreateTask}
}

export default useAddTask