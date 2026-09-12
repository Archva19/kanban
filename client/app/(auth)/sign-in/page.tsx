"use client";

import LeftSide from "@/components/Auth/LeftSide/LeftSide";
import SignInForm from "@/components/Auth/Forms/SignInForm";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import ThemeToggle from "@/components/models/Sections/ThemeToggle";
import MobileRecentLogin from "@/components/Auth/RecentLogins/MobileRecentLogin";
import useDesktop from "@/hooks/useDesktop/useDesktop";
import { useRecentLogins } from "@/context/RecentLoginsContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SignIn() {
  const { recentUsers } = useRecentLogins();
  const { isXl } = useDesktop();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasRecentUsers = mounted && recentUsers.length > 0;
  const t = useTranslations("SignInPage");

  return (
    <>
      <div
        className={`bg-[url('/images/background-stars.svg')] w-screen min-h-screen relative flex items-center justify-center`}
      >
        <div
          className={`w-full flex flex-col items-center justify-center gap-10 ${hasRecentUsers ? "xl:items-start xl:flex-row xl:gap-20 xl:px-50 xl:justify-between" : "flex-col"}`}
        >
          <LeftSide />
          {!isXl && hasRecentUsers ? <MobileRecentLogin /> : <SignInForm />}
          {!isXl && (
            <div>
              <Link
                href="/sign-up"
                className="authBtnStyles border border-[#635FC7] text-[#635FC7] bg-transparent hover:bg-[#635FC7]/10 active:scale-98 transition-all"
              >
                {t("newAccount")}
              </Link>
            </div>
          )}
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
