"use client";

import { usePathname } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";
import { useUser } from "./UserContext";

const ActiveBoardContext = createContext<any>(undefined);

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
  return context;
}
