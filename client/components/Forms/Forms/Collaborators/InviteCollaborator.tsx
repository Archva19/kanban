import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useForms } from "@/context/FormsContext";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import Members from "../../FormItemModels/Members";
import Loader from "./Loader";
import InviteForm from "./InviteForm";
import useInviteCollaborator from "@/hooks/Collaborators/InviteCollaborator/useInviteCollaborator";
import { useCurrentOwner } from "@/context/IsCurrentOwnerContext";

interface InviteCollaboratorsFormValues {
  email: string;
}

export default function InviteCollaborator() {
  const { SetCollaboratorsWindowVis } = useForms();
  const t = useTranslations("InviteCollaborator");
  const { activeBoard } = useActiveBoard();
  const { inviteCollaborator, serverError, successMessage } =
    useInviteCollaborator();
  const { isCurrentOwner } = useCurrentOwner();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteCollaboratorsFormValues>({});

  async function onSubmit(data: InviteCollaboratorsFormValues) {
    if (!activeBoard) return;

    await inviteCollaborator(activeBoard?._id, {
      email: data.email,
    });

    reset();
  }

  const isOwnerLoaded =
    activeBoard?.owner &&
    typeof activeBoard.owner !== "string" &&
    activeBoard.owner.fullName;

  const areCollaboratorsLoaded =
    !activeBoard?.collaborators ||
    activeBoard.collaborators.length === 0 ||
    typeof activeBoard.collaborators[0] !== "string";

  return (
    <>
      <motion.div
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        className="formBg"
        onClick={() => SetCollaboratorsWindowVis(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="cardBgColor formWindow"
          onClick={(e) => e.stopPropagation()}
        >
          {!activeBoard || !isOwnerLoaded || !areCollaboratorsLoaded ? (
            <Loader />
          ) : (
            <div className="flex flex-col gap-6">
              <div>
                <p className="formTitle">
                  {t("membersOf")} {activeBoard?.title}
                </p>
              </div>
              <Members activeBoard={activeBoard} />
              {isCurrentOwner && (
                <InviteForm
                  onSubmit={handleSubmit(onSubmit)}
                  register={register}
                  errors={errors}
                  serverError={serverError}
                  successMessage={successMessage}
                  isSubmitting={isSubmitting}
                  activeBoard={activeBoard}
                />
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
