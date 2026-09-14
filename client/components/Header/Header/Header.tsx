"use client";
import Logo from "../../Logo/Logo";
import DropDown from "../DropDowns/DropDown";
import { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ThreeDots from "../HeaderItems/ThreeDots";
import NewTaskBtn from "../HeaderItems/NewTaskBtn";
import MobileHeaderTitle from "../HeaderItems/MobileHeaderTitle";
import DesktopHeaderTitle from "../HeaderItems/DesktopHeaderTitle";
import BoardDropDown from "../DropDowns/BoardDropDown";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import LanguageSwitcher from "../../CommonItems/LanguageSwitcher/LanguageSwitcher";

export default function Header({
  setProfileWindowVis,
}: {
  setProfileWindowVis: Dispatch<SetStateAction<boolean>>;
}) {
  const [dropDownVis, setDropDownVis] = useState(false);
  const [boardDropDownVis, setBoardDropDownVis] = useState(false);

  const { activeBoard } = useActiveBoard();
  const headerTitle = activeBoard ? activeBoard.title : "Menu";

  return (
    <header className="w-full">
      <div className="z-10 md:z-0 h-16 md:h-20 xl:h-24 relative cardBgColor p-4 flex items-center justify-between md:px-6 md:border-b borderLineColor xl:pr-[32.38px] xl:pt-5 xl:pb-7">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Logo />
          </div>
          <MobileHeaderTitle
            headerTitle={headerTitle}
            dropDownVis={dropDownVis}
            handleOnClick={() => setDropDownVis(!dropDownVis)}
          />
          <DesktopHeaderTitle />
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <LanguageSwitcher />
          <NewTaskBtn />
          <ThreeDots onClick={() => setBoardDropDownVis(!boardDropDownVis)} />
        </div>
      </div>
      <AnimatePresence>
        {dropDownVis && (
          <DropDown
            setDropDownVis={setDropDownVis}
            setProfileWindowVis={setProfileWindowVis}
          />
        )}
        {boardDropDownVis && (
          <BoardDropDown
            onClose={() => setBoardDropDownVis(false)}
            setBoardDropDownVis={setBoardDropDownVis}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
