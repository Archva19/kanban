import axios from "axios";
import { setCookie } from "cookies-next";
import { HatGlasses } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function GuestBtn({
  setServerError,
}: {
  setServerError: (value: string | null) => void;
}) {
  const router = useRouter();
  const t = useTranslations("SignInPage");

  async function handleOnGuestSignIn() {
    try {
      const res = await axios.post("http://localhost:3030/auth/guest-sign-in");
      if (res.status === 200) {
        setCookie("accesstoken", res.data.data, { maxAge: 60 * 60 });
        router.push("/");
      }
    } catch (error) {
      setServerError(t("serverError"));
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOnGuestSignIn}
        className="group bg-[#059669] hover:bg-[#059669]/75 flex items-center justify-center gap-2 text-white py-3 px-6 rounded-[35px] text-[13px] leading-5.75 hover:-translate-y-0.75 shadow-[0_4px_6px_0_rgba(54,78,126,0.1)] hover:shadow-[0_4px_6px_0_rgba(54,78,126,0.5)] transition-all duration-200"
      >
        <HatGlasses color="white"/>
        <span>{t("continueAsGuest")}</span>
      </button>

    </>
  );
}
