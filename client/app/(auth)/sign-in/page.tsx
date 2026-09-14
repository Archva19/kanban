"use client";

import LeftSide from "@/components/Auth/LeftSide/LeftSide";
import SignInForm from "@/components/Auth/Forms/SignInForm";
import LanguageSwitcher from "@/components/CommonItems/LanguageSwitcher/LanguageSwitcher";
import MobileRecentLogin from "@/components/Auth/RecentLogins/RecentLogins/MobileRecentLogin";
import useDesktop from "@/hooks/useDesktop/useDesktop";
import { useRecentLogins } from "@/context/RecentLoginsContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ThemeToggleAuth from "@/components/ThemeToggle/ThemeToggleAuth";
import { ChevronLeft } from "lucide-react";

export default function SignIn() {
  const { recentUsers } = useRecentLogins();
  const { isXl } = useDesktop();
  const [mounted, setMounted] = useState(false);
  const [signInFormVis, setSignInFormVis] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (recentUsers && recentUsers.length > 0) {
      setSignInFormVis(false);
    } else {
      setSignInFormVis(true);
    }
  }, [recentUsers]);

  const hasRecentUsers = mounted && recentUsers.length > 0;
  const t = useTranslations("SignInPage");

  return (
    <>
      <div
        className={`bg-[url('/images/background-stars.svg')] w-screen min-h-screen relative flex items-center justify-center py-20`}
      >
        <div
          className={`w-full flex flex-col items-center justify-center gap-7 md:gap-10 ${hasRecentUsers ? "xl:items-start xl:flex-row xl:gap-20 xl:px-50 xl:justify-between" : "flex-col"}`}
        >
          <LeftSide />
          {!isXl && hasRecentUsers && !signInFormVis ? (
            <MobileRecentLogin setSignInFormVis={setSignInFormVis} />
          ) : (
            <SignInForm />
          )}
          {!isXl && !signInFormVis && (
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
        <div className="flex items-center gap-5 absolute top-5 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-5 xl:right-10 xl:top-10">
          <ThemeToggleAuth />
          <LanguageSwitcher />
        </div>
        {!isXl && hasRecentUsers && signInFormVis && (
          <button
            onClick={() => setSignInFormVis(false)}
            className="absolute top-5 left-5"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}
      </div>
    </>
  );
}
