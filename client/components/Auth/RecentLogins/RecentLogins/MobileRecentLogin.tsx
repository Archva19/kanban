import { useRecentLogins } from "@/context/RecentLoginsContext";
import { useState } from "react";
import ThreeDotsBtnModel from "@/components/models/Buttons/ThreeDotsBtnModel";
import ProfileDeleteModal from "../Modals/ProfileDeleteModal";
import MobileRecentsModal from "../Modals/MobileRecentsModal";
import { useTranslations } from "next-intl";
import { Variants, motion } from "framer-motion";

export default function MobileRecentLogin({
  setSignInFormVis,
}: {
  setSignInFormVis: (value: boolean) => void;
}) {
  const { recentUsers, setSelectedUser } = useRecentLogins();
  const [mobileRecentsModalVis, setMobileRecentsModalVis] = useState(false);
  const [profileDeleteModalVis, setProfileDeleteModalVis] = useState(false);
  const t = useTranslations("RecentLogins");

  function handleOnClickUseAnotherProfile() {
    if (recentUsers.length > 1) {
      setMobileRecentsModalVis(true);
    } else {
      setSignInFormVis(true);
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
        className="relative cardBgColor rounded-2xl py-6 px-6 md:px-8 flex flex-col gap-6 w-[91.466%] max-w-120 items-center shadow-2xl border borderLineColor backdrop-blur-md transition-colors duration-300"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-3 shrink-0"
        >
          <img
            className="w-40 h-40 md:w-50 md:h-50 rounded-full object-cover"
            src={recentUsers[0]?.avatar}
            alt=""
          />
          <p className="text-xl font-semibold">{recentUsers[0]?.fullName}</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="w-full flex flex-col gap-3 max-w-100 md:max-w-120"
        >
          <button
            onClick={() => setSelectedUser(recentUsers[0])}
            className="authBtnStyles authPurpleBtn"
          >
            {t("continue")}
          </button>
          <button
            onClick={handleOnClickUseAnotherProfile}
            className="authBtnStyles authLightPurpleBtn"
          >
            {t("useAnotherProfile")}
          </button>
        </motion.div>
        <div className="absolute top-5 right-5">
          <ThreeDotsBtnModel onClick={() => setProfileDeleteModalVis(true)} />
        </div>
      </motion.div>
      {profileDeleteModalVis && (
        <ProfileDeleteModal
          profileDeleteModalVis={profileDeleteModalVis}
          setProfileDeleteModalVis={setProfileDeleteModalVis}
        />
      )}
      {mobileRecentsModalVis && (
        <MobileRecentsModal
          mobileRecentsModalVis={mobileRecentsModalVis}
          setMobileRecentsModalVis={setMobileRecentsModalVis}
          setSignInFormVis={setSignInFormVis}
        />
      )}
    </>
  );
}
