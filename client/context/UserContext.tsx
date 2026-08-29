"use client";

import useFetchUser from "@/hooks/FetchUser/useFetchUser";
import { createContext, ReactNode, useContext } from "react";

interface UserContextType {
  userData: any;
  boards: any[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserProvider({ children }: { children: ReactNode }) {
  const userData = useFetchUser();
  const boards = userData?.boards || [];
  return (
    <UserContext.Provider value={{ userData, boards }}>
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
