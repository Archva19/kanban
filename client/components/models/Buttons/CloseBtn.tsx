import { X } from "lucide-react";

export default function CloseBtn({ onClickFun }: { onClickFun: () => void }) {
  return (
    <>
      <button
        onClick={onClickFun}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
      >
        <X className="w-4 h-4" />
      </button>
    </>
  );
}
