import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useState } from "react";

function useRemoveCollaborator() {
  const { handleEditBoard } = useUser();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function removeCollaborator(boardId: string, collaboratorId: string) {
    try {
      setLoadingId(collaboratorId);
      const token = getCookie("accesstoken");
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}/collaborators/${collaboratorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status === 200) {
        handleEditBoard(res.data.data);
      }
    } catch (error) {
      console.error("Failed to remove collaborator", error);
    } finally {
      setLoadingId(null);
    }
  }

  return { removeCollaborator, loadingId };
}

export default useRemoveCollaborator;
