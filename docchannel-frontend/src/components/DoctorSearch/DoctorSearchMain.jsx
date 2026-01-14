import { FaSearch } from "react-icons/fa";
import DoctorInput from "./DoctorSerchSectionInput";

function DoctorSearchMain() {
  return (
    <>
      <div className="px-4 sm:px-6 md:px-16 w-full max-w-7xl">
        <div className="bg-[#72A6BB] flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 items-start sm:items-center p-4 sm:p-5 md:p-6 rounded-lg shadow-md">
          {/* Input Fields Container */}
          <div className="flex-1 w-full flex flex-col gap-4">
            {/* First Input - Full Width */}
            <DoctorInput type={"text"} placeHolder={"Search By Doctor Name"} />

            {/* Two Inputs Side by Side */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <select
                className="flex-1 bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition cursor-pointer
  [&>option]:text-gray-900 [&>option]:bg-white"
              >
                <option value="">Select Specialization</option>
                <option value="cardiology">Cardiology</option>
                <option value="dermatology">Dermatology</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="orthopedics">Orthopedics</option>
              </select>

              <select
                className="flex-1 bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition cursor-pointer
  [&>option]:text-gray-900 [&>option]:bg-white"
              >
                <option value="">Select Hospital</option>
                <option value="colombo">Colombo</option>
                <option value="kandy">Kandy</option>
                <option value="galle">Galle</option>
              </select>
            </div>

            {/* Date Input - Full Width */}
            <input
              type="date"
              placeholder="Search By Date"
              className="w-full bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition [color-scheme:dark]"
              style={{
                colorScheme: "dark",
              }}
            />
            {/* Date Input - Full Width */}
          </div>

          {/* Search Button */}
          <div className="w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 font-nunito font-extrabold bg-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md text-[#72A6BB] text-sm sm:text-base hover:bg-gray-100 active:bg-gray-200 transition whitespace-nowrap w-full sm:w-auto">
              <FaSearch size={18} /> Search
            </button>
          </div>
          {/* Search Button */}
        </div>
      </div>
    </>
  );
}

export default DoctorSearchMain;
