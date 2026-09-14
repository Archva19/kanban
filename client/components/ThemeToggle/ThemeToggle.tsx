"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  function handleOnToggle() {
    setTheme(isDark ? "light" : "dark");
  }
  
  return (
    <>
      <div className="w-full bodyBg py-3.5 flex items-center justify-center gap-[23.67px] rounded-md">
        <Image
          src="/icons/sun.svg"
          alt="light"
          width={18}
          height={18}
          priority
        />
        <button
          onClick={handleOnToggle}
          className="w-10 h-5 rounded-xl bg-[#635FC7] relative hover:bg-[#A8A4FF] transition-colors duration-200"
        >
          <motion.div
            initial={false}
            animate={{ x: isDark ? 20 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1/2 -translate-y-1/2 left-0.75 w-3.5 h-3.5 rounded-full bg-white"
          ></motion.div>
        </button>
        <Image
          src="/icons/moon.svg"
          alt="dark"
          width="15"
          height="15"
          priority
        />
      </div>
    </>
  );
}
