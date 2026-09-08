import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import DeleteIcon from "../../models/Icons/DeleteIcon";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface BoardFormModelProps {
  windowType: string;
  handleOnClickBg: () => void;
  handleSubmit: any;
  onSubmit: (data: any) => void;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  fields: FieldArrayWithId<any, "columns", "id">[];
  append: UseFieldArrayAppend<any, "columns">;
  remove: UseFieldArrayRemove;
  autoAddColumn?: boolean;
}

export default function BoardFormModel(props: BoardFormModelProps) {
  const {
    windowType,
    handleOnClickBg,
    handleSubmit,
    onSubmit,
    errors,
    register,
    fields,
    remove,
    append,
    autoAddColumn = false,
  } = props;

  const t = useTranslations("BoardForm");
  const errorsT = useTranslations("FormErrors");

  return (
    <>
      <div className="formBg" onClick={handleOnClickBg}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="cardBgColor formWindow"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <p className="formTitle">
              {windowType === "create" ? t("addBoard") : t("editBoard")}
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <p className="inputTitle">{t("boardName")}</p>
              <div className="relative">
                <input
                  className={`${errors.title ? "errorOnInput pr-28.75!" : "focusOnInput"}`}
                  type="text"
                  placeholder={t("boardNameEx")}
                  {...register("title", {
                    required: errorsT("required"),
                    maxLength: {
                      value: 15,
                      message: errorsT("tooLong"),
                    },
                  })}
                />
                <p className="inputErrorMessage">
                  {errors.title?.message as string}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="inputTitle">{t("boardColumns")}</p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4">
                      <div className="flex-1 relative">
                        <input
                          autoFocus={
                            autoAddColumn && index === fields.length - 1
                          }
                          type="text"
                          {...register(`columns.${index}.title` as const, {
                            maxLength: {
                              value: 15,
                              message: errorsT("tooLong"),
                            },
                          })}
                          className={`${(errors.columns as any)?.[index]?.title ? "errorOnInput pr-28.75!" : "focusOnInput"}`}
                        />
                        <p className="inputErrorMessage">
                          {
                            (errors.columns as any)?.[index]?.title
                              ?.message as string
                          }
                        </p>
                      </div>
                      <button
                        className={`${(errors.columns as any)?.[index]?.title ? "fill-[#EA5555]" : "fill-[#828FA3]"}`}
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
                    {t("addNewColumn")}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full">
              <button className="purpleBtn formBtn" type="submit">
                {windowType === "create" ? t("createBoard") : t("saveChanges")}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
