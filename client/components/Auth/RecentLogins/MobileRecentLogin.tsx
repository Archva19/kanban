import { useRecentLogins } from "@/context/RecentLoginsContext";
import { useState } from "react";
import ThreeDotsBtnModel from "@/components/models/Buttons/ThreeDotsBtnModel";
import ProfileDeleteModal from "./ProfileDeleteModal";
import MobileRecentsModal from "./MobileRecentsModal";

export default function MobileRecentLogin() {
  const { recentUsers, setSelectedUser } =
    useRecentLogins();
  const [mobileRecentsModalVis, setMobileRecentsModalVis] = useState(false);
  const [profileDeleteModalVis, setProfileDeleteModalVis] = useState(false);
  return (
    <>
      <div className="relative cardBgColor rounded-2xl py-6 px-6 md:px-8 flex flex-col gap-6 w-[91.466%] max-w-120 items-center shadow-2xl border borderLineColor backdrop-blur-md transition-colors duration-300">
        <div className="flex flex-col items-center gap-5 shrink-0">
          <img
            className="w-40 h-40 md:w-50 md:h-50 rounded-full object-cover"
            src={recentUsers[0]?.avatar}
            alt=""
          />
          <p className="text-xl font-semibold">{recentUsers[0]?.fullName}</p>
        </div>

        <div className="w-full flex flex-col gap-3 max-w-100 md:max-w-120">
          <button
            onClick={() => setSelectedUser(recentUsers[0])}
            className="authBtnStyles authPurpleBtn"
          >
            Continue
          </button>
          <button
            onClick={() => setMobileRecentsModalVis(true)}
            className="authBtnStyles authLightPurpleBtn"
          >
            Use Another Profile
          </button>
        </div>
        <div className="absolute top-5 right-5">
          <ThreeDotsBtnModel onClick={() => setProfileDeleteModalVis(true)} />
        </div>
      </div>
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
        />
      )}
    </>
  );
}
