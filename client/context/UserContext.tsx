"use client";

import useFetchUser from "@/hooks/FetchUser/useFetchUser";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserContextType {
  userData: any;
  boards: any[];
  addBoard: (newBoard: any) => void;
  handleDeleteBoard: (deletedBoard: any) => void;
  handleEditBoard: (updatedBoard: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({ children }: { children: ReactNode }) {
  const userData = useFetchUser();
  const [boards, setBoards] = useState<any[]>([]);

  useEffect(() => {
    if (userData?.boards) {
      setBoards(userData.boards);
    }
  }, [userData]);

  function addBoard(newBoard: any) {
    setBoards((prev) => [...prev, newBoard]);
  }

  function handleDeleteBoard(deletedId: string) {
    setBoards((prev) => prev.filter((board) => board._id !== deletedId));
  }

  function handleEditBoard(updatedBoard:any) {
    setBoards((prev) =>
      prev.map((board) =>
        board._id === updatedBoard._id ? updatedBoard : board,
      ),
    );
  }

  return (
    <UserContext.Provider
      value={{ userData, boards, addBoard, handleDeleteBoard, handleEditBoard}}
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
