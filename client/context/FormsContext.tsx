"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface FormsContextType {
  newBoardVis: boolean;
  setNewBoardVis: (value: boolean) => void;
  deleteBoardVis: boolean;
  setDeleteBoardVis: (value: boolean) => void;
  deleteMessageVis: boolean;
  setDeleteMessageVis: (value: boolean) => void;
}

const FormsContext = createContext<FormsContextType | undefined>(undefined);

export default function FormsProvider({ children }: { children: ReactNode }) {
  const [newBoardVis, setNewBoardVis] = useState(false);
  const [deleteBoardVis, setDeleteBoardVis] = useState(false);
  const [deleteMessageVis, setDeleteMessageVis] = useState(false);
  return (
    <>
      <FormsContext.Provider value={{ newBoardVis, setNewBoardVis, deleteBoardVis, setDeleteBoardVis, deleteMessageVis, setDeleteMessageVis}}>
        {children}
      </FormsContext.Provider>
    </>
  );
}

export function useForms() {
  const context = useContext(FormsContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
