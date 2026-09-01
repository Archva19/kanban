import { AnimatePresence } from 'motion/react'
import {motion} from "framer-motion"

interface DeleteMessageModelProps{
    content:string
    deleteMessageVis:boolean,
    startTimer:() => void,
    stopTimer:() => void
}

export default function DeleteMessageModel({content, deleteMessageVis, startTimer, stopTimer}:DeleteMessageModelProps) {
  return (
   <>
    <AnimatePresence>
        {deleteMessageVis && (
          <motion.div
            initial={{ bottom: -30 }}
            animate={{ bottom: 8 }}
            exit={{ bottom: -30 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onMouseEnter={stopTimer}
            onMouseLeave={startTimer}
            className="absolute px-4 py-2 bg-[#EA5555] bottom-2 right-2 rounded-sm text-[12px]"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
   </>
  )
}
