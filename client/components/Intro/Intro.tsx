"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Intro({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setShowText(false);
    }, 1000);

    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 1300);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(introTimer);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <div className="w-screen h-screen fixed flex flex-col items-center z-50">
            <motion.div
              initial={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-full h-1/2 cardBgColor"
            />

            <AnimatePresence>
              {showText && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <motion.h1
                    initial={{
                      clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
                      opacity: 0,
                    }}
                    animate={{
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                      opacity: 1,
                    }}
                    exit={{ opacity: 0, filter: "blur(8px)" }}
                    transition={{
                      clipPath: { duration: 0.6, ease: "easeInOut"},
                      opacity: { duration: 0.2 },
                    }}
                    className="text-4xl md:text-6xl font-extrabold tracking-[20px] md:tracking-[60px] xl:tracking-[100px] pl-5 md:pl-7.5 whitespace-nowrap"
                  >
                    KANBAN
                  </motion.h1>
                </div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="w-full h-1/2 cardBgColor"
            />
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </>
  );
}
