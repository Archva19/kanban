"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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
        <Image src="icons/sun.svg" alt="light" width={18} height={18} />
        <button
          onClick={handleOnToggle}
          className="w-10 h-5 rounded-xl bg-[#635FC7] relative"
        >
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white ${isDark ? "right-0.75 left-auto" : "left-0.75 right-auto"}`}
          ></div>
        </button>
        <Image src="icons/moon.svg" alt="dark" width="15" height="15" />
      </div>
    </>
  );
}
