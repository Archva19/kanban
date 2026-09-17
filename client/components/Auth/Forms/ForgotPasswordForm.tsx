"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import * as yup from "yup";
import { forgotPasswordSchema } from "@/validators/forgotPassword";

export type ForgotPasswordFormInputs = yup.InferType<
  typeof forgotPasswordSchema
>;

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const t = useTranslations("ForgotPassword");
  const LoadingTxt = useTranslations("Loading");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function onSubmit(data: ForgotPasswordFormInputs) {
    try {
      setServerError(null);
      setSuccessMessage(null);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        data,
      );

      if (res.status === 200) {
        setSuccessMessage(t("successMessage"));
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        const backendMessage = error.response.data.message;
        if (
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
            <label htmlFor="email" className="authInputTitle">
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
              {isSubmitting ? LoadingTxt("processing") : t("sendLink")}
            </button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              className="authBtnStyles authLightPurpleBtn gap-2 text-center"
              href="/sign-in"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToSignIn")}
            </Link>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}
