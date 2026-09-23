import { Board } from "@/types/types";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface InviteCollaboratorsFormValues {
  email: string;
}

interface InviteFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<InviteCollaboratorsFormValues>;
  errors: FieldErrors<InviteCollaboratorsFormValues>;
  serverError: string | null;
  successMessage: string | null;
  isSubmitting: boolean;
  activeBoard:Board
}

export default function InviteForm({
  onSubmit,
  register,
  errors,
  serverError,
  successMessage,
  isSubmitting,
  activeBoard
}: InviteFormProps) {
  const t = useTranslations("InviteCollaborator");
  const LoadingTxt = useTranslations("Loading");
  const errorsT = useTranslations("FormErrors");
  return (
    <>
      <div className="flex flex-col gap-5">
        <p className="formTitle">
          {t("title")} {activeBoard?.title}
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 relative">
            <p className="inputTitle">{t("email")}</p>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#828FA3] absolute left-3.5" />
              <input
                className={`inputStyles pl-10! ${errors.email ? "errorOnInput pr-28.75!" : "focusOnInput"}`}
                type="text"
                placeholder={t("email")}
                {...register("email", {
                  required: errorsT("required"),
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: errorsT("invalidEmail"),
                  },
                })}
              />
              <p className="inputErrorMessage">
                {errors.email?.message as string}
              </p>
            </div>
            {serverError && (
              <p className="authServerErrorMessage">{serverError}</p>
            )}
            {successMessage && (
              <p className="authServerErrorMessage text-[#059669]!">
                {successMessage}
              </p>
            )}
          </div>
          <div className="w-full">
            <button
              disabled={isSubmitting}
              className="purpleBtn formBtn"
              type="submit"
            >
              {isSubmitting ? LoadingTxt("processing") : t("invite")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
