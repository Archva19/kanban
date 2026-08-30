"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface FormsContextType {
  newBoardVis: boolean;
  setNewBoardVis: (value: boolean) => void;
}

const FormsContext = createContext<FormsContextType | undefined>(undefined);

export default function FormsProvider({ children }: { children: ReactNode }) {
  const [newBoardVis, setNewBoardVis] = useState(false);
  return (
    <>
      <FormsContext.Provider value={{ newBoardVis, setNewBoardVis }}>
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
