import HeaderDocChannel from "../components/HeaderDocChannel/HeaderDocChannel";
import DoctorSearchMain from "../components/DoctorSearch/DoctorSearchMain";
import DoctorCard from "../components/DoctorCard/DoctorCard";
import HospitalLocationCard from "../components/HospitalLocationCard/HospitalLocationCard";

function DoctorList() {
  return (
    <div className="p-3 sm:p-4 md:p-6">
      <HeaderDocChannel />

      <div className="flex justify-center pt-6 sm:pt-8 w-full">
        <DoctorSearchMain />
      </div>

      {/* Hospital Location */}
      <div className="flex flex-col">
        <div className="flex justify-center w-full pt-6 sm:pt-8">
          <HospitalLocationCard
            HospitalCity={"Homagama"}
            HospitalName={"Lanka Hospital"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 pt-6 sm:pt-7 gap-3 sm:gap-4">
          <DoctorCard />
          <DoctorCard />
          <DoctorCard />
          <DoctorCard />
        </div>
      </div>
    </div>
  );
}

export default DoctorList;
