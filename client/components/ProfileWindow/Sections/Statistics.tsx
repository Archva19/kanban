import { useUser } from "@/context/UserContext";
import { useTranslations } from "next-intl";

export default function Statistics() {
  const t = useTranslations("ProfileWindow");
  const { boards } = useUser();

  let totalTasks: number;

  function getAllTasksLength() {
    if (!boards) return 0;

    return boards.reduce((acc, board) => {
      const boardTasksCount =
        board.columns?.reduce(
          (sum: number, col: any) => sum + (col.tasks?.length || 0),
          0,
        ) || 0;
      return acc + boardTasksCount;
    }, 0);
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 bg-[#635FC7]/10 rounded-xl border border-[#635FC7]/20 flex flex-col items-center text-center">
          <span className="text-xl font-bold text-[#635FC7]">
            {boards.length}
          </span>
          <span className="text-[11px] font-semibold text-[#828FA3] uppercase">
           {t("activeBoards")}
          </span>
        </div>
        <div className="p-3.5 bg-[#635FC7]/10 rounded-xl border border-[#635FC7]/20 flex flex-col items-center text-center">
          <span className="text-xl font-bold text-[#635FC7]">
            {getAllTasksLength()}
          </span>
          <span className="text-[11px] font-semibold text-[#828FA3] uppercase">
            {t("totalTasks")}
          </span>
        </div>
      </div>
    </>
  );
}
