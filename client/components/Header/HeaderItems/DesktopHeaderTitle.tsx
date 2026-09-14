import { useActiveBoard } from '@/context/ActiveBoardContext';

export default function DesktopHeaderTitle() {
     const {activeBoard} = useActiveBoard();
  return (
    <>
    <p className="heading hidden md:inline-block leading-6.25 xl:leading-7.5">{activeBoard?.title}</p>
    </>
  )
}
