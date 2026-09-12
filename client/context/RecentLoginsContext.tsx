"use client";

import { RecentUser } from "@/types/auth";
import { getRecentLogins } from "@/utils/recentLogins";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface RecentLoginsContextType {
  recentUsers: RecentUser[];
  setRecentUsers: Dispatch<SetStateAction<RecentUser[]>>;
  selectedUser: RecentUser | null;
  setSelectedUser: Dispatch<SetStateAction<RecentUser | null>>;
}

const RecentLoginsContext = createContext<RecentLoginsContextType | undefined>(
  undefined,
);

export default function RecentLoginsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<RecentUser | null>(null);

  useEffect(() => {
    setRecentUsers(getRecentLogins());
  }, []);

  return (
    <RecentLoginsContext.Provider
      value={{
        recentUsers,
        setRecentUsers,
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </RecentLoginsContext.Provider>
  );
}

export function useRecentLogins() {
  const context = useContext(RecentLoginsContext);
  if (!context) {
    throw new Error(
      "useRecentLogins must be used within a RecentLoginsProvider",
    );
  }
  return context;
}
