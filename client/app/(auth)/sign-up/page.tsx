"use client";

import LeftSide from "@/components/Auth/LeftSide/LeftSide";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "@/components/models/Sections/ThemeToggle";
import { useEffect, useState } from "react";
import { useRecentLogins } from "@/context/RecentLoginsContext";
import SignUpForm from "@/components/Auth/Forms/SignUpForm";

export default function SignUp() {
  const { recentUsers } = useRecentLogins();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasRecentUsers = mounted && recentUsers.length > 0;

  return (
    <>
      <div
        className={`bg-[url('/images/background-stars.svg')] w-screen min-h-screen relative flex items-center justify-center`}
      >
        <div
          className={`w-full flex flex-col items-center justify-center gap-10 ${hasRecentUsers ? "xl:items-start xl:flex-row xl:gap-20 xl:px-50 xl:justify-between" : "flex-col"}`}
        >
          <LeftSide />
          <SignUpForm/>
        </div>
        <div className="absolute top-10 right-10">
          <LanguageSwitcher />
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
