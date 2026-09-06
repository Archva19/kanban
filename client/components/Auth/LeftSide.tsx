import { useTranslations } from "next-intl";
import Logo from "../Logo/Logo";
import AuthLogo from "./AuthLogo";

export default function LeftSide() {
    const t = useTranslations("AuthTxts");
  return (
    <>
      <div className="flex flex-col items-center gap-1 text-center w-[91.466%] lg:flex-1 lg:max-w-135 lg:text-left lg:w-auto lg:items-start lg:gap-10">
        <div className="hidden lg:inline-block">
          <AuthLogo />
        </div>
        <div className = "flex flex-col gap-3">
          <p className="text-[30px] lg:text-[40px]">
            {t("title")}<span className="text-[#635fc7]">.</span>{" "}
          </p>
          <p className="text-[13px] text-[#828FA3] font-medium max-w-120 md:text-[16px] lg:max-w-160">
            {t("description")}
          </p>
        </div>
        <img className="hidden lg:inline-block max-w-110 h-auto" src="images/websiteModel.webp" alt="" />
      </div>
    </>
  );
}
