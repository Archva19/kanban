import Image from "next/image";
import { motion } from "framer-motion";

interface EyeVisBtnProps {
  setSidebarVis: (value: boolean) => void;
}

export default function EyeVisBtn({ setSidebarVis }: EyeVisBtnProps) {
  return (
    <>
      <motion.button
        initial={{ opacity: 0, left: -80 }}
        animate={{ opacity: 1, left: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={() => setSidebarVis(true)}
        className="hidden md:inline-block absolute bottom-8 left-0 purpleBtn rounded-tr-[100px] rounded-br-[100px] pt-4.75 pb-[18.78px] pl-4.5 pr-5.5"
      >
        <Image
          src="/icons/eye.svg"
          alt="sideTab"
          width={16}
          height={11}
        />
      </motion.button>
    </>
  );
}
