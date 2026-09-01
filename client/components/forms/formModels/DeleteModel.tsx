interface DeleteModelProps {
  windowType: string;
  windowVisState: (value: boolean) => void;
  title: string;
  handleOnDelete: () => void;
}

export default function DeleteModel({
  windowType,
  windowVisState,
  title,
  handleOnDelete,
}: DeleteModelProps) {
  return (
    <>
      <div className="formBg" onClick={() => windowVisState(false)}>
        <div
          className="cardBgColor formWindow md:pb-10"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="formTitle text-[#EA5555]">Delete this {windowType}?</p>
          <p className="text-[13px] leading-5.75! text-[#828FA3] font-medium">
            {windowType === "board"
              ? `Are you sure you want to delete the ‘${title}’ board? This action will remove all columns and tasks and cannot be reversed.`
              : `Are you sure you want to delete the ‘${title}’ task and its subtasks? This action cannot be reversed.`}
          </p>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <button className="formBtn redBtn" onClick={handleOnDelete}>
                Delete
              </button>
            </div>
            <div className="flex-1">
              <button
                className="formBtn lightPurpleBtn"
                onClick={() => windowVisState(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
