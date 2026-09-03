interface EmptyMessageModelProps {
  title: string;
  btnTxt: string;
  onClickFun: () => void;
}

export default function EmptyMessageModel({
  title,
  btnTxt,
  onClickFun,
}: EmptyMessageModelProps) {
  return (
    <>
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center w-[91.46%] flex flex-col items-center gap-6 md:w-[90.53%] md:max-w-123.25 xl:gap-8">
          <p className="text-[#828FA3] text-[18px] leading-5.75">{title}</p>
          <button
            onClick={onClickFun}
            className=" purpleBtn text-[15px] w-43.5 rounded-3xl pt-3.75 pb-3.5 px-[17.5px] flex items-center justify-center"
          >
            {btnTxt}
          </button>
        </div>
      </div>
    </>
  );
}
