import { useActiveBoard } from "@/context/ActiveBoardContext";

export default function ThreeDots({ onClick }: { onClick: () => void }) {
  const { activeBoard } = useActiveBoard();
  return (
    <>
      {activeBoard && (
        <button
          onClick={onClick}
          className="flex flex-col items-center gap-[2.46px] w-1.5 md:gap-[3.08px]"
        >
          <div className="w-[3.69px] h-[3.69px] rounded-full bg-[#828FA3] md:w-[4.62px] md:h-[4.62px]"></div>
          <div className="w-[3.69px] h-[3.69px] rounded-full bg-[#828FA3] md:w-[4.62px] md:h-[4.62px]"></div>
          <div className="w-[3.69px] h-[3.69px] rounded-full bg-[#828FA3] md:w-[4.62px] md:h-[4.62px]"></div>
        </button>
      )}
    </>
  );
}
