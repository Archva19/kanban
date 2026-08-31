import { motion } from "framer-motion";

interface MobileHeaderTitleProps{
    headerTitle:string,
    dropDownVis:boolean,
    handleOnClick: () => void;
}

export default function MobileHeaderTitle({headerTitle, dropDownVis, handleOnClick}:MobileHeaderTitleProps) {
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
              className="border-l-2 border-b-2 border-[#635FC7] w-1.5 h-1.5 md:hidden"
            ></motion.div>
          </button>
    </>
  )
}
