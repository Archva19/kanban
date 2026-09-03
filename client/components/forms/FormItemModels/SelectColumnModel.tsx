import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PurpleChevronDown from "@/components/models/PurpleChevronDown";

interface SelectColumnModelProps {
  columns: any;
  selectedColumnId: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleOnSelect: (columnId: string) => void;
}

export default function SelectColumnModel({
  columns,
  selectedColumnId,
  isOpen,
  setIsOpen,
  handleOnSelect,
}: SelectColumnModelProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const selectedColumn =
    columns?.find((col: any) => col._id === selectedColumnId) || columns?.[0];

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 10,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const onSelectColumn = (colId: string) => {
    handleOnSelect(colId);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <div
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`inputStyles relative cursor-pointer flex items-center justify-between ${isOpen && "focusOnDiv"}`}
        >
          <p>{selectedColumn.title}</p>
          <motion.div
            initial={{ rotate: -45 }}
            animate={{ rotate: isOpen ? -225 : -45 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <PurpleChevronDown />
          </motion.div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: `${coords.width}px`,
              }}
              className="modifyDropDown gap-2! fixed overflow-hidden"
            >
              {columns.map((col: any) => (
                <button
                  onClick={() => onSelectColumn(col._id)}
                  className="w-full flex items-start"
                  type="button"
                  key={col._id}
                >
                  {col.title}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
