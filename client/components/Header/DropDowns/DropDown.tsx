import Boards from "../../CommonItems/BoardsList/Boards";
import ThemeToggle from "../../ThemeToggle/ThemeToggle";
import { motion } from "framer-motion";
import Profile from "../../ProfileWindow/Sections/Profile";
import ProfileBtn from "../../CommonItems/ProfileButton/ProfileBtn";
import { Dispatch, SetStateAction } from "react";

interface DropDownProps {
  setDropDownVis: (value: boolean) => void;
  setProfileWindowVis: Dispatch<SetStateAction<boolean>>;
}

export default function DropDown({
  setDropDownVis,
  setProfileWindowVis,
}: DropDownProps) {
  function handleClose() {
    setDropDownVis(false);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        onClick={handleClose}
        className="absolute h-screen w-screen bg-[#000000]/50 top-0 left-0 z-10"
      >
        <motion.div
          initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            opacity: 0,
            transition: { duration: 0.25, ease: "easeInOut" },
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()}
          className="cardBgColor overflow-hidden flex flex-col justify-between w-66 rounded-lg absolute top-20 left-1/2 -translate-x-1/2 py-4"
        >
          <Boards onClose={handleClose} />
          <div className="flex flex-col gap-2">
            <div className="px-4" onClick={() => setDropDownVis(false)}>
              <ProfileBtn
                setProfileWindowVis={setProfileWindowVis}
                onClose={handleClose}
              />
            </div>
            <div className="px-4">
              <ThemeToggle />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
