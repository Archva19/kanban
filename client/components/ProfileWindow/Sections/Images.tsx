import { useUser } from "@/context/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Camera, Loader2, Trash } from "lucide-react";
import { useRef, useState } from "react";

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function Images() {
  const { userData, setUserData } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleOnProfileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsLoading(true);
      const token = getCookie("accesstoken");
      if (!token) return;

      const base64Image: string = await convertToBase64(file);

      const res = await axios.patch(
        `http://localhost:3030/users/profilePicture`,
        { profilePicture: base64Image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data?.data) {
        setUserData((prev: any) => ({
          ...prev,
          profilePicture: res.data.data.profilePicture,
        }));
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    } finally {
      setIsLoading(false);
      if (e.target) e.target.value = "";
    }
  }

  async function handleOnDeleteProfile(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      setIsLoading(true);
      const token = getCookie("accesstoken");
      if (!token) return;

      const res = await axios.patch(
        `http://localhost:3030/users/profilePictureDelete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUserData((prev: any) => ({
        ...prev,
        profilePicture: res.data?.data?.profilePicture,
      }));
    } catch (error) {
      console.error("Error updating profile picture:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="relative">
        <div className="rounded-tl-2xl md:rounded-tl-none rounded-tr-2xl w-full h-35 bg-linear-to-r from-[#635FC7]/30 via-[#635FC7]/40 to-[#635FC7]/50"></div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleOnProfileChange}
          accept="image/*"
          className="hidden"
        />

        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className="cursor-pointer group rounded-full w-30 h-30 absolute left-1/2 -translate-x-1/2 -bottom-15 ring-2 ring-white md:translate-x-0 md:left-14 md:-bottom-10"
        >
          <img
            className="w-full h-full rounded-full object-cover"
            src={userData.profilePicture}
            alt={userData.fullName}
          />

          <div
            className={`transition-all duration-200 bg-[#000000]/60 rounded-full w-full h-full absolute top-0 left-0 flex items-center justify-center ${
              isLoading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-7 w-7 text-white animate-spin" />
            ) : (
              <Camera className="h-7 w-7 text-white" />
            )}
          </div>

          {!isLoading &&
            !userData?.profilePicture?.includes("ui-avatars.com") && (
              <button
                onClick={handleOnDeleteProfile}
                className="absolute bottom-px right-px p-2 bg-[#EA5555]/20 hover:bg-[#EA5555]/40 text-[#EA5555] rounded-full transition-colors backdrop-blur-sm shadow-md"
                title="Remove picture"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
        </div>
      </div>
    </>
  );
}
