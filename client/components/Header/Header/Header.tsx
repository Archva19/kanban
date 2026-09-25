"use client";
import Logo from "../../Logo/Logo";
import DropDown from "../DropDowns/DropDown";
import { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import ThreeDots from "../HeaderItems/ThreeDots";
import NewTaskBtn from "../HeaderItems/NewTaskBtn";
import MobileHeaderTitle from "../HeaderItems/MobileHeaderTitle";
import DesktopHeaderTitle from "../HeaderItems/DesktopHeaderTitle";
import BoardDropDown from "../DropDowns/BoardDropDown";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import LanguageSwitcher from "../../CommonItems/LanguageSwitcher/LanguageSwitcher";
import CollaboratorsBtn from "../HeaderItems/CollaboratorsBtn";
import InvitationsDropDown from "../DropDowns/InvitationsDropDown";
import InvitationsBtn from "../HeaderItems/InvitationsBtn";

export default function Header({
  setProfileWindowVis,
}: {
  setProfileWindowVis: Dispatch<SetStateAction<boolean>>;
}) {
  const [dropDownVis, setDropDownVis] = useState(false);
  const [boardDropDownVis, setBoardDropDownVis] = useState(false);
  const [invitationsDropDownVis, setInvitationsDropDownVis] = useState(false);

  const { activeBoard } = useActiveBoard();
  const headerTitle = activeBoard ? activeBoard.title : "Menu";

  function handleOnClickDropDown() {
    setInvitationsDropDownVis(false);
    setDropDownVis(!dropDownVis);
  }

  function handleOnClickInvitations() {
    setDropDownVis(false);
    setInvitationsDropDownVis(!invitationsDropDownVis);
  }

  return (
    <header className="w-full relative">
      <div className="z-10 md:z-0 h-16 md:h-20 xl:h-24 relative cardBgColor p-4 flex items-center justify-between gap-3 md:px-6 md:border-b borderLineColor xl:pr-[32.38px] xl:pt-5 xl:pb-7">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Logo />
          </div>
          <div className="flex items-center gap-4">
            <MobileHeaderTitle
              headerTitle={headerTitle}
              dropDownVis={dropDownVis}
              handleOnClick={handleOnClickDropDown}
            />
            <DesktopHeaderTitle />
            <CollaboratorsBtn />
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2">
            <InvitationsBtn onClick={handleOnClickInvitations} />
            <div className="hidden min-[900px]:inline-block">
              <LayoutGroup id="header-lang-group">
                <LanguageSwitcher layoutId="headerLangPill" />
              </LayoutGroup>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <NewTaskBtn />
            <ThreeDots onClick={() => setBoardDropDownVis(!boardDropDownVis)} />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {dropDownVis && (
          <DropDown
            key="header-drop-down"
            setDropDownVis={setDropDownVis}
            setProfileWindowVis={setProfileWindowVis}
          />
        )}
        {boardDropDownVis && (
          <BoardDropDown
            key="board-drop-down"
            onClose={() => setBoardDropDownVis(false)}
            setBoardDropDownVis={setBoardDropDownVis}
          />
        )}
        {invitationsDropDownVis && (
          <InvitationsDropDown
            key="invitations-drop-down"
            setInvitationsDropDownVis={setInvitationsDropDownVis}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
