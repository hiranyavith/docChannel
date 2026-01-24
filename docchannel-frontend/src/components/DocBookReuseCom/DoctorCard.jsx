import { FaUserDoctor } from "react-icons/fa6";

function DoctorCard({DoctorName, Speciality, SpecialNote}) {
  return (
    <>
      <div className="w-[100px] h-[100px] flex justify-center items-center">
        <FaUserDoctor size={80} />
      </div>
      <div className="flex flex-col p-3 gap-3 items-center md:items-start">
        <span className="font-nunito font-semibold text-[#FF002F]/47">
          <label htmlFor="">DR</label> {DoctorName.toUpperCase()}
        </span>
        <span className="font-nunito font-bold">{Speciality}</span>
        <div className="flex flex-row">
          <span htmlFor="" className="font-nunito font-bold">
            Special Notes :
          </span>
          &nbsp;
          <span className="font-nunito font-semibold text-[#FF002F]/47">
           {SpecialNote}
          </span>
        </div>
      </div>
    </>
  );
}

export default DoctorCard;
