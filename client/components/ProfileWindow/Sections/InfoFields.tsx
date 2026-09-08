import Email from "../InfoFields/Email";
import FullName from "../InfoFields/FullName";
import Language from "../InfoFields/Language";
import Member from "../InfoFields/Member";

export default function InfoFields() {
  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <FullName />
        <Email />
        <Member />
        <Language />
      </div>
    </>
  );
}
