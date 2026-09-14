"use client";

import { usePathname } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";
import { useUser } from "./UserContext";
import { Board } from "@/types/types";

interface ActiveBoardContextType {
  activeBoard: Board | undefined;
}

const ActiveBoardContext = createContext<ActiveBoardContextType | undefined>(
  undefined,
);

export default function ActiveBoardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { boards } = useUser();

  const activeBoard = boards?.find(
    (board) => pathname === `/boards/${board._id}`,
  );

  return (
    <>
      <ActiveBoardContext.Provider value={{ activeBoard }}>
        {children}
      </ActiveBoardContext.Provider>
    </>
  );
}

export function useActiveBoard() {
  const context = useContext(ActiveBoardContext);
  if (!context) {
    throw new Error(
      "useActiveBoard must be used within an ActiveBoardProvider",
    );
  }
  return context;
}
