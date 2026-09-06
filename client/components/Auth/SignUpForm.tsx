import { SignUpSchema } from "@/validators/signup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import GuestBtn from "./GuestBtn";

interface SignUpFormProps {
  serverError: string | null;
  setServerError: (value: string | null) => void;
}

export default function SignUpForm({
  serverError,
  setServerError,
}: SignUpFormProps) {
  const router = useRouter();
  const t = useTranslations("SignUpPage");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignUpSchema),
  });

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

  return (
    <>
      <div className="flex flex-col gap-6 w-[91.466%] max-w-120 items-center flex-1">
        <p className="heading">{t("title")}</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="cardBgColor w-full p-6 md:p-8 rounded-md flex flex-col gap-8"
        >
          <div className="flex flex-col gap-6 relative">
            <div className="flex flex-col gap-2">
              <p className="inputTitle">{t("fullName")}</p>
              <div className="relative">
                <input
                  className={`${errors.fullName ? "errorOnInput" : "focusOnInput"}`}
                  type="text"
                  placeholder={t("fullName")}
                  {...register("fullName")}
                />
                <p className="inputErrorMessage">
                  {errors.fullName?.message &&
                    t(errors.fullName.message as any)}
                </p>
              </div>
            </div>

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

            <Link className="formBtn lightPurpleBtn" href={"/sign-in"}>
              {t("haveAnAccount")}
            </Link>
          </div>
        </form>
        <GuestBtn setServerError={setServerError} />
      </div>
    </>
  );
}
