"use client";

import { useForms } from "@/context/FormsContext";
import { useUser } from "@/context/UserContext";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BoardsProps {
  onClose?: () => void;
}

export default function Boards({ onClose }: BoardsProps) {
  const pathname = usePathname();
  const { boards } = useUser();
  const { setNewBoardVis } = useForms();
  const t = useTranslations("Boards");

  function handleBoardClick() {
    if (onClose) onClose();
  }

  function handleNewBoardClick() {
    setNewBoardVis(true);
    if (onClose) onClose();
  }

  return (
    <>
      <div className="flex flex-col gap-4.75">
        <p className="text-[#828FA3] text-[12px] tracking-[2.4px] px-6 leading-3.75 xl:px-8">
          {t("allBoards")} ({boards.length})
        </p>
        <div className="flex flex-col">
          <div className="flex flex-col max-h-42 md:max-h-67 overflow-scroll">
            {boards.map((board) => {
              const isActive = pathname === `/boards/${board._id}`;
              const members = [
                ...(board.owner ? [board.owner] : []),
                ...(board.collaborators || []),
              ];
              return (
                <Link
                  key={board._id}
                  href={`/boards/${board._id}`}
                  onClick={handleBoardClick}
                  className={`flex gap-5 group w-60 rounded-tr-[100px] rounded-br-[100px] pt-3.5 pb-3.75 xl:w-69 ${isActive ? "bg-[#635FC7]" : "bg-transparent hover:bg-(--boardButton-hoverBg) transition-colors duration-200"}`}
                >
                  <div className="flex pl-6 gap-3 items-center xl:pl-8 xl:gap-4">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${isActive ? "fill-white" : "fill-[#828FA3] group-hover:fill-[#635FC7]"}`}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.846133 0.846133C0.304363 1.3879 0 2.12271 0 2.88889V13.1111C0 13.8773 0.304363 14.6121 0.846133 15.1538C1.3879 15.6957 2.12271 16 2.88889 16H13.1111C13.8773 16 14.6121 15.6957 15.1538 15.1538C15.6957 14.6121 16 13.8773 16 13.1111V2.88889C16 2.12271 15.6957 1.3879 15.1538 0.846133C14.6121 0.304363 13.8773 0 13.1111 0H2.88889C2.12271 0 1.3879 0.304363 0.846133 0.846133ZM1.33333 13.1111V8.44448H9.77781V14.6667H2.88889C2.03022 14.6667 1.33333 13.9698 1.33333 13.1111ZM9.77781 7.11111V1.33333H2.88889C2.47633 1.33333 2.08067 1.49723 1.78895 1.78895C1.49723 2.08067 1.33333 2.47633 1.33333 2.88889V7.11111H9.77781ZM11.1111 5.77778H14.6667V10.2222H11.1111V5.77778ZM14.6667 11.5555H11.1111V14.6667H13.1111C13.5236 14.6667 13.9194 14.5028 14.2111 14.2111C14.5028 13.9194 14.6667 13.5236 14.6667 13.1111V11.5555ZM14.6667 2.88889V4.44445H11.1111V1.33333H13.1111C13.5236 1.33333 13.9194 1.49723 14.2111 1.78895C14.5028 2.08067 14.6667 2.47633 14.6667 2.88889Z"
                      />
                    </svg>
                    <p
                      className={`leading-4.75 ${isActive ? "text-white" : "text-[#828FA3] group-hover:text-[#635FC7]"}`}
                    >
                      {board.title}
                    </p>
                  </div>

                  <div className="flex -space-x-2 shrink-0 items-center">
                    {members.slice(0, 3).map((member) => (
                      <img
                        key={member._id}
                        src={member.profilePicture}
                        alt={member.fullName || "User Avatar"}
                        className="object-cover rounded-full w-6 h-6 ring ring-white/50"
                      />
                    ))}

                    {members.length > 3 && (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#635FC7] text-white text-[10px] font-bold ring ring-white/50">
                        +{members.length - 3}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <button
            onClick={handleNewBoardClick}
            className="pt-3.5 pb-3.75 px-6 items-center flex gap-3 xl:gap-4 xl:px-8"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-[#635FC7]"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.846133 0.846133C0.304363 1.3879 0 2.12271 0 2.88889V13.1111C0 13.8773 0.304363 14.6121 0.846133 15.1538C1.3879 15.6957 2.12271 16 2.88889 16H13.1111C13.8773 16 14.6121 15.6957 15.1538 15.1538C15.6957 14.6121 16 13.8773 16 13.1111V2.88889C16 2.12271 15.6957 1.3879 15.1538 0.846133C14.6121 0.304363 13.8773 0 13.1111 0H2.88889C2.12271 0 1.3879 0.304363 0.846133 0.846133ZM1.33333 13.1111V8.44448H9.77781V14.6667H2.88889C2.03022 14.6667 1.33333 13.9698 1.33333 13.1111ZM9.77781 7.11111V1.33333H2.88889C2.47633 1.33333 2.08067 1.49723 1.78895 1.78895C1.49723 2.08067 1.33333 2.47633 1.33333 2.88889V7.11111H9.77781ZM11.1111 5.77778H14.6667V10.2222H11.1111V5.77778ZM14.6667 11.5555H11.1111V14.6667H13.1111C13.5236 14.6667 13.9194 14.5028 14.2111 14.2111C14.5028 13.9194 14.6667 13.5236 14.6667 13.1111V11.5555ZM14.6667 2.88889V4.44445H11.1111V1.33333H13.1111C13.5236 1.33333 13.9194 1.49723 14.2111 1.78895C14.5028 2.08067 14.6667 2.47633 14.6667 2.88889Z"
              />
            </svg>
            <p className="text-[15px] text-[#635FC7] leading-4.75">
              {t("newBoard")}
            </p>
          </button>
        </div>
      </div>
    </>
  );
}
