import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";

export default function UserGuard({ children }: { children: React.ReactNode }) {
  const { userData } = useUser();

  if (!userData) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((index) => (
            <motion.div
              initial={{ scaleY: 0.3 }}
              animate={{
                scaleY: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.18,
              }}
              key={index}
              className="w-3 h-12.25 bg-[#635FC7] rounded-sm"
              style={{ opacity: 1 - 0.25 * index }}
            ></motion.div>
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
