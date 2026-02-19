import { FaSearch } from "react-icons/fa";
import DoctorInput from "./DoctorSerchSectionInput";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DoctorSearchMain() {
  const navigate = useNavigate();
  const [specialization, setSpecialization] = useState([]);
  const [searchData, setSearchData] = useState({
    doctorName: "",
    specialization: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/appointments/specializations`,
      );
      if (response.data.success) {
        setSpecialization(response.data.specialization);
      }
    } catch (error) {
      console.error("Failed to fetch specializations:", error);
    }
  };

  const handleSearch = () => {
    // Navigate with search params
    const params = new URLSearchParams();
    if (searchData.doctorName)
      params.append("doctorName", searchData.doctorName);
    if (searchData.specialization)
      params.append("specialization", searchData.specialization);
    if (searchData.date) params.append("date", searchData.date);

    navigate(`/searchdoc?${params.toString()}`);
  };

  return (
    <>
      <div className="px-4 sm:px-6 md:px-16 w-full max-w-7xl">
        <div className="bg-[#72A6BB] flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 items-start sm:items-center p-4 sm:p-5 md:p-6 rounded-lg shadow-md">
          {/* Input Fields Container */}
          <div className="flex-1 w-full flex flex-col gap-4">
            {/* First Input - Full Width */}
            <input
              type="text"
              placeholder="Search By Doctor Name"
              value={searchData.doctorName}
              onChange={(e) =>
                setSearchData({ ...searchData, doctorName: e.target.value })
              }
              className="w-full bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition"
            />

            {/* Two Inputs Side by Side */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <select
                value={searchData.specialization}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    specialization: e.target.value,
                  })
                }
                disabled={loading}
                className="flex-1 bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition cursor-pointer
  [&>option]:text-gray-900 [&>option]:bg-white"
              >
                <option value="">
                  {loading ? "Loading..." : "Select Specialization"}
                </option>
                {specialization.map((spec, index) => (
                  <option key={index} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input - Full Width */}
            <input
              type="date"
              value={searchData.date}
              onChange={(e) =>
                setSearchData({ ...searchData, date: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition [color-scheme:dark]"
              style={{
                colorScheme: "dark",
              }}
            />
            {/* Date Input - Full Width */}
          </div>

          {/* Search Button */}
          <div className="w-full sm:w-auto">
            <button
              className="flex items-center justify-center gap-2 font-nunito font-extrabold bg-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md text-[#72A6BB] text-sm sm:text-base hover:bg-gray-100 active:bg-gray-200 transition whitespace-nowrap w-full sm:w-auto"
              onClick={handleSearch}
            >
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
