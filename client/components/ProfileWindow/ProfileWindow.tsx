"use client";
import CloseBtn from "./Buttons/CloseBtn";
import { motion } from "framer-motion";
import { useState } from "react";
import SandwichMenuBtn from "./Buttons/SandwichMenuBtn";
import Menu from "./Sections/Menu";
import Profile from "./Sections/Profile";

export default function ProfileWindow({
  setProfileWindowVis,
}: {
  setProfileWindowVis: (value: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
        className="flex w-[90%] max-w-4xl cardBgColor rounded-2xl relative"
      >
        {isOpen && <Menu />}
        <div className="hidden md:inline-block">
          <Menu />
        </div>
        <div
          className={`w-full md:opacity-100 ${isOpen ? "opacity-0" : "opacity-100"}`}
        >
          <Profile />
        </div>
        <SandwichMenuBtn setIsOpen={setIsOpen} isOpen={isOpen} />
        <CloseBtn setProfileWindowVis={setProfileWindowVis} />
      </motion.div>
    </div>
  );
}
