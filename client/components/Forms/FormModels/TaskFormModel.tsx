import {
  FieldArrayWithId,
  FieldErrors,
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import DeleteIcon from "../../models/Icons/DeleteIcon";
import SelectColumnModel from "../FormItemModels/SelectColumnModel";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Board } from "@/types/types";
import { CalendarDays } from "lucide-react";

export interface TaskFormValues extends FieldValues {
  title: string;
  description?: string;
  dueDate?: string;
  subTasks: { _id?: string; title: string; isCompleted?: boolean }[];
  columnId: string;
}

interface TaskFormModelProps {
  windowType: "create" | "edit";
  windowVisState: (value: boolean) => void;
  handleSubmit: UseFormHandleSubmit<TaskFormValues>;
  onSubmit: (data: TaskFormValues) => void;
  register: UseFormRegister<TaskFormValues>;
  errors: FieldErrors<TaskFormValues>;
  isSubmitting: boolean;
  fields: FieldArrayWithId<TaskFormValues, "subTasks", "id">[];
  append: UseFieldArrayAppend<TaskFormValues, "subTasks">;
  remove: UseFieldArrayRemove;
  activeBoard: Board | null | undefined;
  watch: UseFormWatch<TaskFormValues>;
  setValue: UseFormSetValue<TaskFormValues>;
}

export default function TaskFormModel(props: TaskFormModelProps) {
  const {
    windowType,
    windowVisState,
    handleSubmit,
    onSubmit,
    register,
    errors,
    isSubmitting,
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

  const t = useTranslations("TaskForm");
  const LoadingTxt = useTranslations("Loading");
  const errorsT = useTranslations("FormErrors");

  return (
    <>
      <motion.div
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        className="formBg"
        onClick={() => windowVisState(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`cardBgColor formWindow relative`}
          onClick={onClickWindow}
        >
          <div>
            <p className="formTitle">
              {windowType === "create" ? t("addTask") : t("editTask")}
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <p className="inputTitle">{t("title")}</p>
              <div className="relative">
                <input
                  className={`inputStyles ${errors.title ? "errorOnInput" : "focusOnInput"}`}
                  type="text"
                  placeholder={t("titleEx")}
                  {...register("title", {
                    required: errorsT("required"),
                  })}
                />
                <p className="inputErrorMessage">
                  {errors.title?.message as string}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="inputTitle">{t("description")}</p>
              <div className="relative h-28">
                <textarea
                  className="inputStyles h-28! focusOnInput resize-none"
                  placeholder={t("descriptionEx")}
                  {...register("description")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="inputTitle">{t("dueDate")}</p>
              <div className="relative flex items-center cursor-pointer">
                <input
                  onClick={(e) => e.currentTarget.showPicker()}
                  type="date"
                  className="inputStyles focusOnInput cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
                  {...register("dueDate")}
                />
                <CalendarDays className="w-4 h-4 absolute right-3 text-[#828FA3] pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="inputTitle">{t("subtasks")}</p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          placeholder={
                            index === 0 ? t("subtaskEx1") : t("subtaskEx2")
                          }
                          type="text"
                          {...register(`subTasks.${index}.title`)}
                          className="inputStyles"
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
                    {t("addSubtask")}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="inputTitle">{t("status")}</p>
              <SelectColumnModel
                columns={activeBoard?.columns}
                selectedColumnId={selectedColumnId}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handleOnSelect={(colId) => setValue("columnId", colId)}
              />
            </div>

            <div className="w-full">
              <button
                disabled={isSubmitting}
                className="purpleBtn formBtn"
                type="submit"
              >
                {windowType === "create"
                  ? isSubmitting
                    ? LoadingTxt("creating")
                    : t("createTask")
                  : isSubmitting
                    ? LoadingTxt("editing")
                    : t("saveChanges")}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
}
