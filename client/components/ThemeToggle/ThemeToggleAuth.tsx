"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const themes = [
  { code: "light", icon: "/icons/sun.svg", alt: "light" },
  { code: "dark", icon: "/icons/moon.svg", alt: "dark" },
];

export default function ThemeToggleAuth() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative flex items-center h-7 p-0.5 rounded-full cardBgColor border borderLineColor select-none justify-center">
      {themes.map((t) => {
        const isActive = theme === t.code;

        return (
          <button
            key={t.code}
            type="button"
            onClick={() => setTheme(t.code)}
            className="relative z-10 h-full w-7 flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            {isActive && (
              <motion.div
                layoutId="activeThemePill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 z-[-1] rounded-full bg-[#635FC7] shadow-xs shadow-[#635FC7]/40"
              />
            )}
            <Image
              src={t.icon}
              alt={t.alt}
              width={14}
              height={14}
              priority
              className={`transition-all duration-200 ${
                isActive ? "brightness-0 invert" : "opacity-60 hover:opacity-100"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}