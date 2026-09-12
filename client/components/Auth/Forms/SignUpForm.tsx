import { SignUpSchema } from "@/validators/signup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import GuestBtn from "../Items/GuestBtn";
import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";
import { useState } from "react";
import { motion, Variants } from "framer-motion";

export default function SignUpForm() {
  const router = useRouter();
  const t = useTranslations("SignUpPage");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(SignUpSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const passwordValue = watch("password");

  async function onSubmit(data: any) {
    try {
      setServerError(null);
      const res = await axios.post("http://localhost:3030/auth/sign-up", data);
      if (res.status === 200) {
        router.push("/sign-in");
      }
    } catch (error: any) {
      if (error.response && error.response.data?.message) {
        const backendMessage = error.response.data.message;

        if (backendMessage === "User with this email already exists") {
          setServerError(t("userExists"));
        } else if (
          backendMessage === "Full Name, Email and Password are required fields"
        ) {
          setServerError(t("requiredFields"));
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
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        y: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
        opacity: { duration: 0.5, ease: "easeInOut" },
      },
    },
  };

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="cardBgColor rounded-2xl py-8 px-6 md:px-8 flex flex-col gap-6 w-[91.466%] max-w-120 items-center shadow-2xl border borderLineColor backdrop-blur-md transition-all duration-300"
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
              <label htmlFor={"fullName"} className="authInputTitle">
                {t("fullName")}
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#828FA3] absolute left-3.5" />
                <input
                  id={"fullName"}
                  className={`authInputStyles bodyBg ${errors.fullName ? "errorOnInput" : "focusOnInput"}`}
                  type="text"
                  placeholder={t("fullName")}
                  {...register("fullName")}
                />
                <p className="authInputErrorMessage">
                  {errors.fullName?.message &&
                    t(errors.fullName.message as any)}
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <label htmlFor={"email"} className="authInputTitle">
                {t("email")}
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#828FA3] absolute left-3.5" />
                <input
                  id={"email"}
                  className={`authInputStyles bodyBg ${errors.email ? "errorOnInput" : "focusOnInput"}`}
                  type="email"
                  placeholder={t("email")}
                  {...register("email")}
                />
                <p className="authInputErrorMessage">
                  {errors.email?.message && t(errors.email.message as any)}
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
                  {errors.password?.message &&
                    t(errors.password.message as any)}
                </p>
              </div>
            </motion.div>
            {serverError && (
              <div className="font-medium text-[#EA5555] absolute left-0 -bottom-6 text-[12px]">
                {serverError}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <motion.div variants={itemVariants}>
              <button type="submit" className="authBtnStyles authPurpleBtn">
                {t("title")}
              </button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                className="authBtnStyles authLightPurpleBtn"
                href={"/sign-in"}
              >
                {t("haveAnAccount")}
              </Link>
            </motion.div>
          </div>
        </form>
        <motion.div
          variants={itemVariants}
          className="w-full border-t borderLineColor pt-4 flex items-center justify-center"
        >
          <GuestBtn setServerError={setServerError} />
        </motion.div>
      </motion.div>
    </>
  );
}
