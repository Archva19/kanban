"use client";

import NewBoard from "@/components/forms/NewBoard";
import Header from "@/components/Header/Header";
import SideLogo from "@/components/Header/SideLogo";
import EyeVisBtn from "@/components/models/EyeVisBtn";
import Sidebar from "@/components/Sidebar/Sidebar";
import FormsProvider, { useForms } from "@/context/FormsContext";
import UserProvider, { useUser } from "@/context/UserContext";
import { AnimatePresence } from "motion/react";
import { useState } from "react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarVis, setSidebarVis] = useState(true);
  const { userData } = useUser();
  const { newBoardVis } = useForms();

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
      {newBoardVis && <NewBoard />}
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
      <FormsProvider>
        <UserProvider>
          <DashboardContent>{children}</DashboardContent>
        </UserProvider>
      </FormsProvider>
    </>
  );
}
