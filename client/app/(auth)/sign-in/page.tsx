"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";
import { SignInSchema } from "@/validators/signin";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function SignIn() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignInSchema),
  });

  const router = useRouter();
  const t = useTranslations("SignInPage");

  async function onSubmit(data: any) {
    try {
      setServerError(null);
      const res = await axios.post("http://localhost:3030/auth/sign-in", data);
      if (res.status === 200) {
        setCookie("accesstoken", res.data.data, { maxAge: 60 * 60 });
        router.push("/");
      }
    } catch (error: any) {
      if (error.response && error.response.data?.message) {
        const backendMessage = error.response.data.message;

        if (backendMessage === "Email or Password is incorrect") {
          setServerError(t("invalidCredentials"));
        } else if (
          backendMessage === "Email and Password are required fields"
        ) {
          setServerError(t("requiredFields"));
        } else if (
          backendMessage ===
          "Too many login attempts, please try again after 15 minutes."
        ) {
          setServerError(t("tooManyAttempts")); // 👈 დაემატა rate limit-ის თარგმანი
        } else {
          setServerError(t("serverError"));
        }
      } else {
        setServerError(t("serverError"));
      }
    }
  }

  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center relative">
        <div className="flex flex-col gap-6 w-[91.466%] mx-auto max-w-120 items-center ">
          <p className="heading">{t("title")}</p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="cardBgColor w-full p-6 md:p-8 rounded-md flex flex-col gap-8"
          >
            <div className="flex flex-col gap-6 relative">
              <div className="flex flex-col gap-2">
                <p className="inputTitle">{t("email")}</p>
                <div className="relative">
                  <input
                    className={`${errors.email ? "errorOnInput" : "focusOnInput"}`}
                    type="email"
                    placeholder={t("email")}
                    {...register("email")}
                  />
                  <p className="inputErrorMessage">
                    {errors.email?.message && t(errors.email.message as any)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="inputTitle">{t("password")}</p>
                <div className="relative">
                  <input
                    className={`${errors.password ? "errorOnInput" : "focusOnInput"}`}
                    type="password"
                    placeholder={t("password")}
                    {...register("password")}
                  />
                  <p className="inputErrorMessage">
                    {errors.password?.message &&
                      t(errors.password.message as any)}
                  </p>
                </div>
              </div>
              {serverError && (
                <div className="font-medium text-[#EA5555] absolute left-0 -bottom-6 text-[12px]">
                  {serverError}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <button type="submit" className="formBtn purpleBtn">
                  {t("title")}
                </button>
              </div>

              <Link className="formBtn lightPurpleBtn" href={"/sign-up"}>
                {t("newAccount")}
              </Link>
            </div>
          </form>
        </div>
        <div className="absolute top-10 right-10">
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
}
