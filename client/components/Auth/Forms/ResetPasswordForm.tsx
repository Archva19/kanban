"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import * as yup from "yup";
import { resetPasswordSchema } from "@/validators/resetPassword";

export type ResetPasswordFormInputs = yup.InferType<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormInputs>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const t = useTranslations("ResetPassword");
  const LoadingTxt = useTranslations("Loading");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const newPasswordValue = watch("newPassword");
  const confirmPasswordValue = watch("confirmPassword");

  async function onSubmit(data: ResetPasswordFormInputs) {
    if (!token || !email) {
      setServerError(t("missingTokenOrEmail"));
      return;
    }

    try {
      setServerError(null);
      setSuccessMessage(null);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          email,
          token,
          newPassword: data.newPassword,
        },
      );

      if (res.status === 200) {
        setSuccessMessage(t("successMessage"));
        setTimeout(() => {
          router.push(`/sign-in?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        const backendMessage = error.response.data.message;

        if (backendMessage === "Invalid or expired token") {
          setServerError(t("invalidOrExpiredToken"));
        } else if (
          backendMessage ===
          "Too many password reset attempts, please try again after 15 minutes."
        ) {
          setServerError(t("tooManyAttempts"));
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="cardBgColor rounded-2xl py-6 px-6 md:px-8 flex flex-col gap-6 w-[91.466%] max-w-120 items-center shadow-2xl border borderLineColor backdrop-blur-md transition-colors duration-300"
    >
      <motion.p variants={itemVariants} className="text-2xl tracking-wide">
        {t("title")}
      </motion.p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6"
      >
        <div className="flex flex-col gap-4 relative">
          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label htmlFor="newPassword" className="authInputTitle">
              {t("newPassword")}
            </label>
            <div className="relative flex items-center">
              <LockKeyhole className="w-4 h-4 text-[#828FA3] absolute left-3.5" />
              <input
                id="newPassword"
                className={`authInputStyles bodyBg ${errors.newPassword ? "errorOnInput" : "focusOnInput"}`}
                type={showPassword ? "text" : "password"}
                placeholder={t("newPassword")}
                {...register("newPassword")}
              />
              {newPasswordValue && (
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
                {errors.newPassword?.message && t(errors.newPassword.message)}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="authInputTitle">
              {t("confirmPassword")}
            </label>
            <div className="relative flex items-center">
              <LockKeyhole className="w-4 h-4 text-[#828FA3] absolute left-3.5" />
              <input
                id="confirmPassword"
                className={`authInputStyles bodyBg ${errors.confirmPassword ? "errorOnInput" : "focusOnInput"}`}
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("confirmPassword")}
                {...register("confirmPassword")}
              />
              {confirmPasswordValue && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-[#828FA3] transition-colors p-1 rounded-md"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              )}
              <p className="authInputErrorMessage">
                {errors.confirmPassword?.message &&
                  t(errors.confirmPassword.message)}
              </p>
            </div>
          </motion.div>

          {serverError && (
            <div className="authServerErrorMessage">{serverError}</div>
          )}

          {successMessage && (
            <div className="authServerErrorMessage text-[#059669]!">
              {successMessage}
            </div>
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
              className="authBtnStyles authLightPurpleBtn flex items-center justify-center gap-2"
              href="/sign-in"
            >
              {t("backToSignIn")}
            </Link>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}
