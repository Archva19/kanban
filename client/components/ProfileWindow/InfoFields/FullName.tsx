import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Check, PencilSparkles, User, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function FullName() {
  const t = useTranslations("ProfileWindow");
  const { userData, setUserData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(userData.fullName);

  async function handleSave() {
    try {
      const token = getCookie("accesstoken");
      if (!token) return;

      const res = await axios.patch(
        `http://localhost:3030/users/fullName`,
        { fullName: fullName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUserData((prev: any) => ({
        ...prev,
        fullName: res.data?.data?.fullName,
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating Full Name", error);
    }
  }

  function handleCancel(){
    setIsEditing(false);
    setFullName(userData.fullName)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wider text-[#828FA3]">
          {t("fullName")}
        </span>
        <div className="flex items-center justify-between gap-3 bodyBg border borderLineColor rounded-lg py-3 px-4 w-full h-11.5">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-[#635FC7] shrink-0" />
            {isEditing ? (
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                autoFocus
                className="py-0! px-1! w-auto! h-5! text-[14px]!"
              />
            ) : (
              <p className="font-medium text-sm truncate">
                {userData?.fullName}
              </p>
            )}
          </div>
          {isEditing ? (
            <div className="flex items-center gap-2 h-full w-auto">
              <button onClick={handleSave}>
                <Check className="w-4 h-4" />
              </button>
              <button onClick={handleCancel}>
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)}>
              <PencilSparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
