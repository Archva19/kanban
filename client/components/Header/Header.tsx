"use client";
import Logo from "../Logo/Logo";
import Image from "next/image";
import DropDown from "./DropDown";
import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Header() {
  const [dropDownVis, setDropDownVis] = useState(false);
  const pathname = usePathname();
  const { boards } = useUser();

  const activeBoard = boards.find(
    (board) => pathname === `/boards/${board._id}`,
  );

  const headerTitle = activeBoard ? activeBoard.title : "Menu";

  return (
    <header className="w-full">
      <div className="z-10 relative cardBgColor p-4 flex items-center justify-between md:px-6 md:border-b borderLineColor xl:pr-[32.38px] xl:pt-5 xl:pb-7">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Logo />
          </div>
          <button
            onClick={() => setDropDownVis(!dropDownVis)}
            className="flex items-center gap-2 cursor-pointer md:hidden"
          >
            <p className="heading">{headerTitle}</p>
            <motion.div
              initial={{ rotate: -45 }}
              animate={{ rotate: dropDownVis ? -225 : -45 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="border-l-2 border-b-2 border-[#635FC7] w-1.5 h-1.5 md:hidden"
            ></motion.div>
          </button>
          <div className="hidden md:flex">
            <p className="heading">{activeBoard?.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-[13.69px] md:gap-[22.62px]">
          <button className="purpleBtn rounded-3xl py-2.5 px-4.5 md:h-12 md:pt-3.75 md:pb-3.5 md:px-[24.5]">
            <Image
              className="md:hidden"
              src="icons/+.svg"
              alt="+"
              width={12}
              height={12}
            />
            <div className="hidden md:flex text-[15px]">
              <p>+</p>
              <p>Add New Task</p>
            </div>
          </button>
          <button className="flex flex-col items-center gap-[2.46px] w-1.5 md:gap-[3.08px]">
            <div className="w-[3.69px] h-[3.69px] rounded-full bg-[#828FA3] md:w-[4.62px] md:h-[4.62px]"></div>
            <div className="w-[3.69px] h-[3.69px] rounded-full bg-[#828FA3] md:w-[4.62px] md:h-[4.62px]"></div>
            <div className="w-[3.69px] h-[3.69px] rounded-full bg-[#828FA3] md:w-[4.62px] md:h-[4.62px]"></div>
          </button>
        </div>
      </div>
      {dropDownVis && <DropDown setDropDownVis={setDropDownVis} />}
    </header>
  );
}
