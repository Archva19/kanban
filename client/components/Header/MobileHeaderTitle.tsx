import { motion } from "framer-motion";
import PurpleChevronDown from "../models/PurpleChevronDown";

interface MobileHeaderTitleProps {
  headerTitle: string;
  dropDownVis: boolean;
  handleOnClick: () => void;
}

export default function MobileHeaderTitle({
  headerTitle,
  dropDownVis,
  handleOnClick,
}: MobileHeaderTitleProps) {
  return (
    <>
      <button
        onClick={handleOnClick}
        className="flex items-center gap-2 cursor-pointer md:hidden"
      >
        <p className="heading">{headerTitle}</p>
        <motion.div
          initial={{ rotate: -45 }}
          animate={{ rotate: dropDownVis ? -225 : -45 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <PurpleChevronDown />
        </motion.div>
      </button>
    </>
  );
}
