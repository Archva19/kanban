"use client";

import AllForms from "@/components/Forms/AllForms/AllForms";
import Header from "@/components/Header/Header/Header";
import SideLogo from "@/components/Header/HeaderItems/SideLogo";
import Intro from "@/components/Intro/Intro";
import EyeVisBtn from "@/components/Sidebar/EyeVisBtn";
import ProfileWindow from "@/components/ProfileWindow/ProfileWindow/ProfileWindow";
import Sidebar from "@/components/Sidebar/Sidebar";
import UserGuard from "@/components/UserGuard/UserGuard";
import ActiveBoardProvider from "@/context/ActiveBoardContext";
import FormsProvider from "@/context/FormsContext";
import UserProvider from "@/context/UserContext";
import { AnimatePresence } from "motion/react";
import { useState } from "react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [sidebarVis, setSidebarVis] = useState(true);
  const [profileWindowVis, setProfileWindowVis] = useState(false);

  return (
    <>
      <Intro>
        <UserGuard>
          <div className="flex w-screen h-screen overflow-hidden">
            <AnimatePresence>
              {sidebarVis && (
                <Sidebar
                  setSidebarVis={setSidebarVis}
                  setProfileWindowVis={setProfileWindowVis}
                />
              )}
            </AnimatePresence>
            <div className="flex-1 flex flex-col h-full min-w-0">
              <div className="flex w-full">
                {!sidebarVis && <SideLogo />}
                <Header setProfileWindowVis={setProfileWindowVis} />
              </div>
              <main className="w-full h-full overflow-hidden">{children}</main>
            </div>
            {!sidebarVis && <EyeVisBtn setSidebarVis={setSidebarVis} />}
          </div>
          <AllForms />
          <AnimatePresence>
            {profileWindowVis && (
              <ProfileWindow setProfileWindowVis={setProfileWindowVis} />
            )}
          </AnimatePresence>
        </UserGuard>
      </Intro>
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
