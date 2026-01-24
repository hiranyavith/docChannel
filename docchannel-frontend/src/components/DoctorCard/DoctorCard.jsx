import { MdPerson } from "react-icons/md";
import { LuStethoscope } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

function DoctorCard() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-around items-center gap-3 sm:gap-4 bg-[#D9D9D9]/55 border-l-[#72A6BB] border-l-4 sm:border-l-5 rounded-sm p-3 sm:p-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-[100px] md:h-[100px] bg-[#D9D9D9] flex justify-center items-center rounded-lg flex-shrink-0">
          <MdPerson className="w-full h-full" color="white" />
        </div>
        <div className="flex flex-col gap-1 sm:gap-2 justify-center text-center sm:text-left flex-1">
          <span className="font-nunito font-bold text-[#BB7272] text-sm sm:text-base md:text-lg">
            DR. AJITH ABEGUNASEKARA
          </span>
          <span className="font-nunito font-semibold text-xs sm:text-sm md:text-base">
            EYE SURGEON
          </span>
        </div>
        <div className="flex flex-col gap-2 justify-center w-full sm:w-auto">
          <button
            onClick={() => {
              navigate("/docbook");
            }}
            className="flex items-center justify-center gap-2 font-nunito font-semibold bg-[#72A6BB] px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md text-white text-xs sm:text-sm md:text-base hover:bg-[#5a8a9d] active:bg-[#4a7a8d] transition whitespace-nowrap w-full sm:w-auto"
          >
            <LuStethoscope size={25} />
            Channel Doctor
          </button>
        </div>
      </div>
    </>
  );
}

export default DoctorCard;
