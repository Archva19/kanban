export default function GetStarted() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center w-[91.46%] flex flex-col items-center gap-6 md:w-[90.53%] md:max-w-123.25 xl:gap-8">
        <p className="text-[#828FA3] text-[18px] ">
          Your Boards are empty. Create a board to get started.
        </p>
        <button className=" purpleBtn text-[15px] w-43.5 rounded-3xl pt-3.75 pb-3.5 px-[17.5px] flex items-center justify-center">
          + Add New Board
        </button>
      </div>
    </div>
  );
}
