import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import DeleteIcon from "../../models/DeleteIcon";
import SelectColumnModel from "../FormItemModels/SelectColumnModel";
import { useState } from "react";
import { motion } from "framer-motion";

interface TaskFormModelProps {
  windowType: "create" | "edit";
  windowVisState: (value: boolean) => void;
  handleSubmit: any;
  onSubmit: (data: any) => void;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  fields: FieldArrayWithId<any, "subTasks", "id">[];
  append: UseFieldArrayAppend<any, "subTasks">;
  remove: UseFieldArrayRemove;
  activeBoard: any;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export default function TaskFormModel(props: TaskFormModelProps) {
  const {
    windowType,
    windowVisState,
    handleSubmit,
    onSubmit,
    register,
    errors,
    fields,
    append,
    remove,
    activeBoard,
    watch,
    setValue,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const selectedColumnId = watch("columnId") || activeBoard?.columns[0]?._id;

  function onClickWindow(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsOpen(false);
  }

  return (
    <>
      <div className="formBg" onClick={() => windowVisState(false)}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`cardBgColor formWindow relative`}
          onClick={onClickWindow}
        >
          <div>
            <p className="formTitle">
              {windowType === "create" ? "Add New Task" : "Edit Task"}
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <p className="inputTitle">Title</p>
              <div className="relative">
                <input
                  className={`${errors.title ? "errorOnInput" : "focusOnInput"}`}
                  type="text"
                  placeholder="e.g. Take coffee break"
                  {...register("title", {
                    required: "Can’t be empty",
                  })}
                />
                <p className="inputErrorMessage">
                  {errors.title?.message as string}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="inputTitle">Description</p>
              <div className="relative h-28">
                <textarea
                  className="focusOnInput resize-none"
                  placeholder="e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little."
                  {...register("description")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="inputTitle">Subtasks</p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          placeholder={
                            index === 0
                              ? "e.g. Make coffee"
                              : "e.g. Drink coffee & smile"
                          }
                          type="text"
                          {...register(`subTasks.${index}.title` as const)}
                          className="w-full p-2 border borderLineColor rounded bg-transparent"
                        />
                      </div>
                      <button
                        className="fill-[#828FA3]"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="w-full">
                  <button
                    className="lightPurpleBtn formBtn"
                    type="button"
                    onClick={() => append({ title: "" })}
                  >
                    + Add New Subtask
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="inputTitle">Status</p>
              <SelectColumnModel
                columns={activeBoard.columns}
                selectedColumnId={selectedColumnId}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleOnSelect={(colId) => setValue("columnId", colId)}
              />
            </div>

            <div className="w-full">
              <button className="purpleBtn formBtn" type="submit">
                {windowType === "create" ? "Create Task" : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
