"use client";

import useFetchUser from "@/hooks/Others/FetchUser/useFetchUser";
import { Board, User } from "@/types/types";
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
