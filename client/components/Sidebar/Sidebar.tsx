import Image from "next/image";
import Logo from "../Logo/Logo";
import Boards from "../models/Boards";
import ThemeToggle from "../models/ThemeToggle";
import { motion } from "framer-motion";
import useDesktop from "@/hooks/useDesktop/useDesktop";

interface SideBarProps {
  sidebarVis: boolean;
  setSidebarVis: (value: boolean) => void;
}

export default function Sidebar({ setSidebarVis }: SideBarProps) {
  const isDesktop = useDesktop();
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "auto" }}
      exit={{ width: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="cardBgColor overflow-hidden whitespace-nowrap hidden md:flex md:h-screen  md:py-8 md:border-r borderLineColor "
    >
      <div className="h-full flex justify-between flex-col md:w-65.25 xl:w-75">
        <div className="flex flex-col gap-13.5 w-full">
          <div className="md:px-6.5 xl:px-8.5">
            <Logo />
          </div>
          <Boards />
        </div>
        <div className="flex flex-col gap-4 xl:gap-5.5">
          <div className="px-[12.5px] xl:px-6">
            <ThemeToggle />
          </div>
          <button
            onClick={() => setSidebarVis(false)}
            className="flex gap-2.5 px-6 items-center xl:gap-3.75 xl:px-7.75"
          >
            <Image src="/icons/eye-slash.svg" alt="" width={18} height={16} />
            <p className="text-[#828FA3] text-[15px]">Hide Sidebar</p>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
