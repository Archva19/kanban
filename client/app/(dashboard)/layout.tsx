"use client";

import AllForms from "@/components/forms/AllForms/AllForms";
import Header from "@/components/Header/Header";
import SideLogo from "@/components/Header/SideLogo";
import EyeVisBtn from "@/components/models/EyeVisBtn";
import Sidebar from "@/components/Sidebar/Sidebar";
import ActiveBoardProvider from "@/context/ActiveBoardContext";
import FormsProvider, { useForms } from "@/context/FormsContext";
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
      <div className="flex w-screen h-screen">
        <AnimatePresence>
          {sidebarVis && (
            <Sidebar sidebarVis={sidebarVis} setSidebarVis={setSidebarVis} />
          )}
        </AnimatePresence>
        <div className="flex-1 flex flex-col h-full min-w-0">
          <div className="flex w-full">
            {!sidebarVis && <SideLogo />}
            <Header />
          </div>
          <main className="w-full h-full overflow-hidden">{children}</main>
        </div>
        {!sidebarVis && <EyeVisBtn setSidebarVis={setSidebarVis} />}
      </div>
      <AllForms />
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
          <ActiveBoardProvider>
            <DashboardContent>{children}</DashboardContent>
          </ActiveBoardProvider>
        </UserProvider>
      </FormsProvider>
    </>
  );
}
