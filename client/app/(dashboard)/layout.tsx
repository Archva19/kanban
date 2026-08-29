"use client";

import Header from "@/components/Header/Header";
import SideLogo from "@/components/Header/SideLogo";
import EyeVisBtn from "@/components/models/EyeVisBtn";
import Sidebar from "@/components/Sidebar/Sidebar";
import UserProvider, { useUser } from "@/context/UserContext";
import { AnimatePresence } from "motion/react";
import { useState } from "react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarVis, setSidebarVis] = useState(true);
  const { userData } = useUser();

  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex">
        <AnimatePresence>
          {sidebarVis && (
            <Sidebar sidebarVis={sidebarVis} setSidebarVis={setSidebarVis} />
          )}
        </AnimatePresence>
        <div className="flex-1 flex flex-col h-screen">
          <div className="flex w-full">
            {!sidebarVis && <SideLogo />}
            <Header />
          </div>
          <main className="h-full w-full flex items-center justify-center">
            {children}
          </main>
        </div>
        {!sidebarVis && <EyeVisBtn setSidebarVis={setSidebarVis} />}
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserProvider>
        <DashboardContent>{children}</DashboardContent>
      </UserProvider>
    </>
  );
}
