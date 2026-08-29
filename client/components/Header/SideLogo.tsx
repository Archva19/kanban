import Logo from "../Logo/Logo";
import { motion } from "framer-motion";

export default function SideLogo() {
  return (
    <>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "auto", opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="hidden md:flex items-center justify-center self-stretch cardBgColor borderLineColor border-r border-b"
      >
        <div className="md:pl-6 md:pr-[24.47px] xl:pr-[32.47px]">
          <Logo />
        </div>
      </motion.div>
    </>
  );
}
