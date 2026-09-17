import { SignInSchema } from "@/validators/signin";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import GuestBtn from "../Items/GuestBtn";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { saveRecentUser } from "@/utils/recentLogins";
import { useRecentLogins } from "@/context/RecentLoginsContext";
import { motion, Variants } from "framer-motion";
import * as InferYup from "yup";

export type SignInFormInputs = InferYup.InferType<typeof SignInSchema>;

export default function SignInForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormInputs>({
    resolver: yupResolver(SignInSchema),
    defaultValues: {
      email,
    },
  });

  const { recentUsers } = useRecentLogins();
  const router = useRouter();
  const t = useTranslations("SignInPage");
  const LoadingTxt = useTranslations("Loading");
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const passwordValue = watch("password");

  async function onSubmit(data: SignInFormInputs) {
    try {
      setServerError(null);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`,
        data,
      );
      if (res.status === 200) {
        setCookie("accesstoken", res.data.data, { maxAge: 60 * 60 * 24 });
        saveRecentUser({
          email: res.data.user.email,
          fullName: res.data.user.fullName,
          avatar: res.data.user.profilePicture,
        });
        router.push("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
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
          setServerError(t("tooManyAttempts"));
        } else if (backendMessage === "Please verify your email first") {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        } else {
          setServerError(t("serverError"));
        }
      } else {
        setServerError(t("serverError"));
      }
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.06,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        y: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
        opacity: { duration: 0.4, ease: "easeInOut" },
      },
    },
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`cardBgColor rounded-2xl py-6 px-6 md:px-8 flex flex-col gap-6 w-[91.466%] max-w-120 items-center shadow-2xl border borderLineColor backdrop-blur-md transition-colors duration-300 ${recentUsers!.length !== 0 && "xl:mt-18"}`}
      >
        <motion.p variants={itemVariants} className="text-2xl tracking-wide">
          {t("title")}
        </motion.p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4 relative">
            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <label htmlFor={"email"} className="authInputTitle">
                {t("email")}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#828FA3] absolute left-3.5" />
                <input
                  id="email"
                  className={`authInputStyles bodyBg ${errors.email ? "errorOnInput" : "focusOnInput"}`}
                  type="email"
                  placeholder={t("email")}
                  {...register("email")}
                />
                <p className="authInputErrorMessage">
                  {errors.email?.message && t(errors.email.message)}
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <label htmlFor={"password"} className="authInputTitle">
                {t("password")}
              </label>
              <div className="relative flex items-center">
                <LockKeyhole className="w-4 h-4 text-[#828FA3] absolute left-3.5" />
                <input
                  id="password"
                  className={`authInputStyles bodyBg ${errors.password ? "errorOnInput" : "focusOnInput"}`}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("password")}
                  {...register("password")}
                />
                {passwordValue && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#828FA3] transition-colors p-1 rounded-md"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                )}
                <p className="authInputErrorMessage">
                  {errors.password?.message && t(errors.password.message)}
                </p>
              </div>
            </motion.div>
            <motion.div
              className="absolute right-0 -bottom-4 sm:-bottom-5"
              variants={itemVariants}
            >
              <Link
                href="/forgot-password"
                className="text-[10px] sm:text-[11px] font-medium text-[#635FC7]/90 hover:text-[#635FC7] hover:underline transition-colors"
              >
                {t("forgotPassword")}
              </Link>
            </motion.div>

            {serverError && (
              <div className="authServerErrorMessage absolute -bottom-7! sm:-bottom-4.5!">{serverError}</div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <motion.div variants={itemVariants}>
              <button
                disabled={isSubmitting}
                type="submit"
                className="authBtnStyles authPurpleBtn"
              >
                {isSubmitting ? LoadingTxt("processing") : t("title")}
              </button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                className="authBtnStyles authLightPurpleBtn"
                href={"/sign-up"}
              >
                {t("newAccount")}
              </Link>
            </motion.div>
          </div>
        </form>
        <motion.div
          variants={itemVariants}
          className="w-full border-t borderLineColor pt-6 flex items-center justify-center"
        >
          <GuestBtn setServerError={setServerError} />
        </motion.div>
      </motion.div>
    </>
  );
}
