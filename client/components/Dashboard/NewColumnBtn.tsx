import { useForms } from "@/context/FormsContext";

export default function NewColumnBtn() {
  const { setEditBoardVis, setAutoAddColumn } = useForms();

  function handleOnClickNewColumn() {
    setEditBoardVis(true);
    setAutoAddColumn(true);
  }

  return (
    <>
      <div className="min-w-70 flex flex-col gap-6 h-full">
        <div className="h-3.75 w-full"></div>
        <button
          onClick={handleOnClickNewColumn}
          className="leading-7.5 h-[92%] max-h-203.5 BgGradient text-[#828FA3] text-[24px] font-bold min-w-70 rounded-md flex items-center justify-center hover:text-[#635FC7] transition-colors duration-200"
        >
          + New Column
        </button>
      </div>
    </>
  );
}
