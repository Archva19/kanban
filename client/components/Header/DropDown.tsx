import Boards from "../models/Boards";
import ThemeToggle from "../models/ThemeToggle";
import { motion } from "framer-motion";

interface DropDownProps {
  setDropDownVis: (value: boolean) => void;
}

export default function DropDown({ setDropDownVis}: DropDownProps) {
  return (
    <>
      <div
        onClick={() => setDropDownVis(false)}
        className="absolute h-screen w-screen bg-[#000000]/50 top-0 left-0"
      >
        <motion.div
          initial={{ opacity: 0, height:0 }}
          animate={{ opacity: 1, height: 322 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={(e) => e.stopPropagation()}
          className="cardBgColor overflow-hidden flex flex-col justify-between w-66 h-80.5 rounded-lg absolute top-20 left-1/2 -translate-x-1/2 py-4"
        >
          <Boards />
          <div className="px-4">
            <ThemeToggle />
          </div>
        </motion.div>
      </div>
    </>
  );
}
