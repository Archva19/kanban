"use client";

import LeftSide from "@/components/Auth/LeftSide/LeftSide";
import LanguageSwitcher from "@/components/CommonItems/LanguageSwitcher/LanguageSwitcher";
import { useEffect, useState } from "react";
import { useRecentLogins } from "@/context/RecentLoginsContext";
import ThemeToggleAuth from "@/components/ThemeToggle/ThemeToggleAuth";
import { useSearchParams } from "next/navigation";
import VerifyEmailForm from "@/components/Auth/Forms/VerifyEmailForm";

export default function VerifyEmail() {
  const { recentUsers } = useRecentLogins();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasRecentUsers = mounted && recentUsers.length > 0;

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  if (!email) {
    return <p>Invalid verification link.</p>
  }

  return (
    <>
      <div
        className={`bg-[url('/images/background-stars.svg')] w-screen min-h-screen relative flex items-center justify-center py-20`}
      >
        <div
          className={`w-full flex flex-col items-center justify-center gap-10 ${hasRecentUsers ? "xl:items-start xl:flex-row xl:gap-20 xl:px-50 xl:justify-between" : "flex-col"}`}
        >
          <LeftSide />
          <VerifyEmailForm email={email} />
        </div>
        <div className="flex items-center gap-5 absolute top-5 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-5 xl:right-10 xl:top-10">
          <ThemeToggleAuth />
          <LanguageSwitcher layoutId="authLangPill" />
        </div>
      </div>
    </>
  );
}
