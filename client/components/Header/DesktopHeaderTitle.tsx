import { useActiveBoard } from '@/context/ActiveBoardContext';

export default function DesktopHeaderTitle() {
     const {activeBoard} = useActiveBoard();
  return (
    <>
    <p className="heading hidden md:inline-block">{activeBoard?.title}</p>
    </>
  )
}
