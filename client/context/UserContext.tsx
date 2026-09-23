"use client";

import useFetchUser from "@/hooks/Others/FetchUser/useFetchUser";
import { Board, User } from "@/types/types";
import { socket } from "@/utils/socket";
import { usePathname } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserContextType {
  userData: User | null;
  setUserData: Dispatch<SetStateAction<User | null>>;
  boards: Board[];
  addBoard: (newBoard: Board) => void;
  handleDeleteBoard: (deletedId: string) => void;
  handleEditBoard: (updatedBoard: Board) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({ children }: { children: ReactNode }) {
  const { userData, setUserData } = useFetchUser();
  const pathname = usePathname();

  const boards = userData?.boards || [];

  function addBoard(newBoard: Board) {
    setUserData((prev) => {
      if (!prev) return null;
      const exists = prev.boards?.some((b) => b._id === newBoard._id);
      if (exists) return prev;

      return {
        ...prev,
        boards: [...(prev.boards || []), newBoard],
      };
    });
  }

  function handleDeleteBoard(deletedId: string) {
    setUserData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        boards: (prev.boards || []).filter((board) => board._id !== deletedId),
      };
    });
  }

  function handleEditBoard(updatedBoard: Board) {
    setUserData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        boards: (prev.boards || []).map((board) =>
          board._id === updatedBoard._id ? updatedBoard : board,
        ),
      };
    });
  }

  useEffect(() => {
    const userId = userData?._id;
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join_user", userId);

    const handleRemovedFromBoard = (boardId: string) => {
      handleDeleteBoard(boardId);
    };

    socket.on("removed_from_board", handleRemovedFromBoard);

    return () => {
      socket.off("removed_from_board", handleRemovedFromBoard);
      socket.disconnect();
    };
  }, [userData?._id, handleDeleteBoard]);

  useEffect(() => {
    const currentBoardId = pathname?.startsWith("/boards/")
      ? pathname.split("/")[2]
      : null;

    if (!currentBoardId || !userData?._id) return;

    socket.emit("join_board", currentBoardId);

    const handleBoardUpdated = (updatedBoard: Board) => {
      handleEditBoard(updatedBoard);
    };

    const handleBoardDeleted = (deletedBoardId: string) => {
      handleDeleteBoard(deletedBoardId);
    };

    socket.on("board_updated", handleBoardUpdated);
    socket.on("board_deleted", handleBoardDeleted);

    return () => {
      socket.emit("leave_board", currentBoardId);
      socket.off("board_updated", handleBoardUpdated);
      socket.off("board_deleted", handleBoardDeleted);
    };
  }, [pathname, userData?._id, handleEditBoard, handleDeleteBoard]);

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        boards,
        addBoard,
        handleDeleteBoard,
        handleEditBoard,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
