import Logo from "../Logo/Logo";
import Boards from "../models/Boards";
import ThemeToggle from "../models/ThemeToggle";
import { motion } from "framer-motion";
import HideSidebarBtn from "./HideSidebarBtn";
import ProfileBtn from "./ProfileBtn";

interface SideBarProps {
  setSidebarVis: (value: boolean) => void;
}

export default function Sidebar({ setSidebarVis }: SideBarProps) {
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

        <div className="flex flex-col gap-2">
          <div className="px-[12.5px] xl:px-6">
            <ThemeToggle />
          </div>
          <div className="px-[12.5px] xl:px-6">
            <ProfileBtn />
          </div>
          <HideSidebarBtn setSidebarVis={setSidebarVis} />
        </div>
      </div>
    </motion.div>
  );
}
