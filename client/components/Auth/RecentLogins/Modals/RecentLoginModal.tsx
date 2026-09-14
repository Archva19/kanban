import CloseBtn from "@/components/models/Buttons/CloseBtn";
import { useRecentLogins } from "@/context/RecentLoginsContext";
import { saveRecentUser } from "@/utils/recentLogins";
import axios from "axios";
import { setCookie } from "cookies-next";
import { motion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormInput {
  password: string;
}

export default function RecentLoginModal() {
  const t = useTranslations("SignInPage");
  const LoadingTxt = useTranslations("Loading");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<null | string>(null);
  const router = useRouter();
  const { selectedUser, setSelectedUser } = useRecentLogins();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>();

  const passwordValue = watch("password");

  async function onSubmit(data: FormInput) {
    if (!selectedUser) return;
    try {
      setServerError(null);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`, {
        email: selectedUser.email,
        password: data.password,
      });
      if (res.status === 200) {
        setCookie("accesstoken", res.data.data, { maxAge: 60 * 60 * 24 });
        saveRecentUser({
          email: selectedUser.email,
          fullName: selectedUser.fullName,
          avatar: selectedUser.avatar,
        });
        setSelectedUser(null);
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
          setServerError(t("passwordRequired"));
        } else if (
          backendMessage ===
          "Too many login attempts, please try again after 15 minutes."
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

  return (
    <>
      <motion.div
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        onClick={() => setSelectedUser(null)}
        className="formBg backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col w-[90%] max-w-sm cardBgColor rounded-2xl relative pt-15 pb-8 px-7 gap-5"
        >
          <div className="flex flex-col items-center gap-2">
            <img
              className="w-40 h-40 rounded-full object-cover"
              src={selectedUser?.avatar}
              alt=""
            />
            <p className="text-lg font-semibold">{selectedUser?.fullName}</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="authInputTitle">
                {t("password")}
              </label>
              <div className="relative flex items-center">
                <LockKeyhole className="w-4 h-4 text-[#828FA3] absolute left-3.5 pointer-events-none" />
                <input
                  id="password"
                  className={`authInputStyles bodyBg ${
                    errors.password || serverError
                      ? "errorOnInput"
                      : "focusOnInput"
                  }`}
                  type={showPassword ? "text" : "password"}
                  placeholder={t("password")}
                  {...register("password", { required: true })}
                />
                {passwordValue && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#828FA3] hover:text-mainText transition-colors p-1 rounded-md"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                )}
                <p className="authServerErrorMessage">
                  {errors.password
                    ? t("passwordRequired")
                    : serverError
                      ? serverError
                      : null}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="authBtnStyles authPurpleBtn"
            >
              {isSubmitting ? LoadingTxt("processing") : t("title")}
            </button>
          </form>

          <CloseBtn onClickFun={() => setSelectedUser(null)} />
        </motion.div>
      </motion.div>
    </>
  );
}
