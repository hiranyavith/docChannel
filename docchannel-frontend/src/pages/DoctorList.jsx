import HeaderDocChannel from "../components/HeaderDocChannel/HeaderDocChannel";
import DoctorSearchMain from "../components/DoctorSearch/DoctorSearchMain";
import DoctorCard from "../components/DoctorCard/DoctorCard";
import HospitalLocationCard from "../components/HospitalLocationCard/HospitalLocationCard";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DoctorList() {
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    searchDoctors();
  }, [searchParams]);

  const searchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        doctorName: searchParams.get("doctorName") || "",
        specialization: searchParams.get("specialization") || "",
        date: searchParams.get("date") || "",
      };

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/appointments/search`,
        { params },
      );

      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to search doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <HeaderDocChannel Title={"DocChannel"} />

      <div className="flex justify-center pt-6 sm:pt-8 w-full">
        <DoctorSearchMain />
      </div>

      {/* Hospital Location */}
      <div className="flex flex-col pt-6 sm:pt-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <p className="font-nunito text-lg">Searching doctors...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <p className="font-nunito text-lg text-red-500">{error}</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <p className="font-nunito text-lg text-gray-600">
              No doctors found matching your criteria. Try adjusting your
              search.
            </p>
          </div>
        ) : (
          <>
            <p className="font-nunito font-bold text-xl mb-4">
              Found {doctors.length} doctor{doctors.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.doctor_id}
                  doctorId={doctor.doctor_id}
                  DoctorName={doctor.doctor_full_name}
                  Speciality={doctor.specialization}
                  SpecialNote={doctor.special_note}
                  schedules={doctor.schedules}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorList;
