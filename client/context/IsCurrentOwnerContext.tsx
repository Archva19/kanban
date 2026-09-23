"use client";
import { createContext, ReactNode, useContext } from "react";
import { useActiveBoard } from "./ActiveBoardContext";
import { useUser } from "./UserContext";

interface FormsContextType {
  isCurrentOwner: boolean;
}

const IsCurrentOwnerContext = createContext<FormsContextType | undefined>(
  undefined,
);

export default function IsCurrentOwnerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { activeBoard } = useActiveBoard();
  const { userData } = useUser();

  const ownerId =
    typeof activeBoard?.owner === "object"
      ? activeBoard?.owner?._id
      : activeBoard?.owner;

  const isCurrentOwner = Boolean(
    ownerId && userData?._id && ownerId === userData._id,
  );

  return (
    <>
      <IsCurrentOwnerContext.Provider value={{ isCurrentOwner }}>
        {children}
      </IsCurrentOwnerContext.Provider>
    </>
  );
}

export function useCurrentOwner() {
  const context = useContext(IsCurrentOwnerContext);
  if (!context) {
    throw new Error(
      "useCurrentOwner must be used within a IsCurrentOwnerProvider",
    );
  }
  return context;
}
