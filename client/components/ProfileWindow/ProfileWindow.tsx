"use client";
import CloseBtn from "../models/Buttons/CloseBtn";
import { motion } from "framer-motion";
import Profile from "./Sections/Profile";
import LogOutBnt from "./Buttons/LogOutBnt";
import { useUser } from "@/context/UserContext";

export default function ProfileWindow({
  setProfileWindowVis,
}: {
  setProfileWindowVis: (value: boolean) => void;
}) {
  const { userData } = useUser();

  return (
    <div
      onClick={() => setProfileWindowVis(false)}
      className="formBg backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
        className="flex w-[90%] h-[90%] max-h-200 md:h-auto max-w-4xl cardBgColor rounded-2xl relative overflow-scroll"
      >
        <Profile />
        <CloseBtn onClickFun={() => setProfileWindowVis(false)} />
        {!userData.isGuest && (
          <div className="absolute top-4 left-5">
            <LogOutBnt />
          </div>
        )}
      </motion.div>
    </div>
  );
}
