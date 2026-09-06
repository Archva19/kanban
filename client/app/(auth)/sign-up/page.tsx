"use client";

import AuthLogo from "@/components/Auth/AuthLogo";
import LeftSide from "@/components/Auth/LeftSide";
import SignUpForm from "@/components/Auth/SignUpForm";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { useState } from "react";

export default function SignUp() {
  const [serverError, setServerError] = useState<string | null>(null);

  return (
    <>
      <div className=" w-screen min-h-screen flex flex-col items-center justify-center pb-30 pt-40 gap-10 relative lg:gap-20 lg:flex-row lg:px-20 lg:py-20 ">
        <LeftSide />
        <SignUpForm serverError={serverError} setServerError={setServerError} />
        <div className="absolute top-8 lg:hidden">
          <AuthLogo />
        </div>
        <div className="absolute top-10 right-10">
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
