import { useUser } from "@/context/UserContext";
import GuestJoinBtns from "../Buttons/GuestJoinBtns";
import Images from "./Images";
import InfoFields from "./InfoFields";
import Statistics from "./Statistics";
import DeleteAccount from "./DeleteAccount";

export default function Profile() {
  const { userData } = useUser();
  return (
    <>
      <div className="flex flex-col gap-16 flex-1 rounded-br-2xl rounded-tr-2xl">
        <Images />
        <div className="px-7 py-5 flex flex-col gap-10">
          <InfoFields />
          <Statistics />
          {userData?.isGuest && <GuestJoinBtns />}
          {!userData?.isGuest && <DeleteAccount />}
        </div>
      </div>
    </>
  );
}
