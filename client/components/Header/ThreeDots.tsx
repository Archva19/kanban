import { useActiveBoard } from "@/context/ActiveBoardContext";
import ThreeDotsBtnModel from "../models/ThreeDotsBtnModel";

export default function ThreeDots({ onClick }: { onClick: () => void }) {
  const { activeBoard } = useActiveBoard();
  return (
    <>
      {activeBoard && (
        <ThreeDotsBtnModel onClick = {onClick}/>
      )}
    </>
  );
}
