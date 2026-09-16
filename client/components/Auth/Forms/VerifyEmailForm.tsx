import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";

interface VerifyEmailFormProps {
  email: string;
}

export default function VerifyEmailForm({ email }: VerifyEmailFormProps) {
  const router = useRouter();
  const t = useTranslations("VerifyEmail");
  const LoadingTxt = useTranslations("Loading");

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 6) {
      setServerError(t("incompleteCode"));
      return;
    }

    try {
      setLoading(true);
      setServerError(null);
      setSuccessMessage(null);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/verify/verify-email`,
        { email, code },
      );

      if (res.status === 200) {
        router.push(`/sign-in?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        const message = error.response.data.message;
        if (message === "User not found") {
          setServerError(t("userNotFound"));
        } else if (message === "Verification code has expired") {
          setServerError(t("codeExpired"));
        } else if (message === "Invalid verification code") {
          setServerError(t("invalidCode"));
        } else {
          setServerError(t("serverError"));
        }
      } else {
        setServerError(t("serverError"));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (cooldown > 0 || resendLoading) return;

    try {
      setResendLoading(true);
      setServerError(null);
      setSuccessMessage(null);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/verify/resend-verification`,
        { email },
      );

      setSuccessMessage(t("codeResentSuccess"));
      setCooldown(60);
      setOtp(Array(6).fill(""));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        const message = error.response.data.message;
        if (
          message === "Too many verification attempts. Please try again later."
        ) {
          setServerError(t("tooManyAttempts"));
        } else {
          setServerError(t("serverError"));
        }
      } else {
        setServerError(t("serverError"));
      }
    } finally {
      setResendLoading(false);
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
        className="cardBgColor rounded-2xl py-8 px-6 md:px-8 flex flex-col gap-6 w-[91.466%] max-w-120 items-center shadow-2xl border borderLineColor backdrop-blur-md transition-all duration-300"
      >
        <motion.p
          variants={itemVariants}
          className="text-2xl tracking-wide text-center"
        >
          {t("title")}
        </motion.p>

        <motion.div variants={itemVariants} className="text-sm text-center">
          <p className="text-[#828FA3] ">{t("description")}</p>
          <span className="font-medium">{email}</span>
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
          <motion.div
            variants={itemVariants}
            className="flex justify-between gap-2 sm:gap-5.5 relative w-full"
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="flex-1 min-w-0 h-14 text-center text-xl font-bold rounded-lg bodyBg border borderLineColor focusOnInput transition-all outline-none"
              />
            ))}
            {serverError && (
              <p className="authServerErrorMessage">{serverError}</p>
            )}
            {successMessage && (
              <p className="authServerErrorMessage text-[#059669]!">
                {successMessage}
              </p>
            )}
          </motion.div>

          <div className="flex flex-col gap-3">
            <motion.div variants={itemVariants}>
              <button
                disabled={loading}
                type="submit"
                className="authBtnStyles authPurpleBtn w-full py-3 rounded-full bg-[#635FC7] hover:bg-[#A8A4FF] text-white font-bold transition-all"
              >
                {loading ? LoadingTxt("processing") : t("verifyBtn")}
              </button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={cooldown > 0 || resendLoading}
                className="text-sm text-[#828FA3] hover:text-[#635FC7] disabled:text-gray-500 transition-colors text-center font-medium pt-2"
              >
                {resendLoading
                  ? LoadingTxt("processing")
                  : cooldown > 0
                    ? `${t("resendCodeIn")} ${cooldown}s`
                    : t("resendCode")}
              </button>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </>
  );
}
