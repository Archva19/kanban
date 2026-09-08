export default function ThreeDotsBtnModel({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <>
      <button
        onClick={onClick}
        className="relative flex flex-col items-center gap-[2.46px] md:gap-[3.08px] before:absolute before:-inset-2.5"
      >
        <div className="w-[3.69px] h-[3.69px] rounded-full bg-[#828FA3] md:w-[4.62px] md:h-[4.62px]"></div>
        <div className="w-[3.69px] h-[3.69px] rounded-full bg-[#828FA3] md:w-[4.62px] md:h-[4.62px]"></div>
        <div className="w-[3.69px] h-[3.69px] rounded-full bg-[#828FA3] md:w-[4.62px] md:h-[4.62px]"></div>
      </button>
    </>
  );
}
