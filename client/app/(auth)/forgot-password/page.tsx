"use client";

import ForgotPasswordForm from "@/components/Auth/Forms/ForgotPasswordForm";
import LeftSide from "@/components/Auth/LeftSide/LeftSide";
import LanguageSwitcher from "@/components/CommonItems/LanguageSwitcher/LanguageSwitcher";
import ThemeToggleAuth from "@/components/ThemeToggle/ThemeToggleAuth";

export default function page() {
  return (
    <>
      <div
        className={`bg-[url('/images/background-stars.svg')] w-screen min-h-screen relative flex items-center justify-center py-20`}
      >
        <div
          className={`w-full flex flex-col items-center justify-center gap-10`}
        >
          <LeftSide />
          <ForgotPasswordForm />
        </div>
        <div className="flex items-center gap-5 absolute top-5 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-5 xl:right-10 xl:top-10">
          <ThemeToggleAuth />
          <LanguageSwitcher layoutId="authLangPill" />
        </div>
      </div>
    </>
  );
}
