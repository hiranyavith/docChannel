import Footer from "../components/Footer/Footer";
import HeaderDocChannel from "../components/HeaderDocChannel/HeaderDocChannel";
import HospitalNameCard from "../components/DocBookReuseCom/HospitalName";
import DoctorCard from "../components/DocBookReuseCom/DoctorCard";
import SessionCountCard from "../components/DocBookReuseCom/SessionCountCard";
import AppointmentCard from "../components/DocBookReuseCom/AppointmentCard";

function DoctorBookPage() {
  return (
    <>
      <div className="p-3 sm:p-4 md:p-6">
        <HeaderDocChannel Title={"DocChannel"}/>
        <div className="py-5">
          <HospitalNameCard
            HospitalName={"Lanka Hospital"}
            HospitalLocation={"Homagama"}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center bg-[#D9D9D9]/47 shadow-xl/10 p-3">
          <DoctorCard DoctorName={"Ajith Abegunasekara"} Speciality={"Eye Surgon"} SpecialNote={"None"}/>
        </div>
        <div className="py-8">
          <HospitalNameCard
            HospitalName={"Lanka Hospital"}
            HospitalLocation={"Homagama"}
          />
        </div>
        <div className="flex flex-col gap-[35px]">
          <div className="flex bg-[#D9D9D9]/47 border-l-4 rounded-lg">
            <SessionCountCard SessionCount={1} Speciality={"Eye Surgon"}/>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between justify-center items-center bg-[#D9D9D9]/47 p-3 border-l-4 rounded-sm gap-3">
            <AppointmentCard ActiveAppointmentCount={3} Date={"JANUARY 21, 2026"} Time={"FRI, 02:00 P.M"} AppointmentStatus={"ACTIVE"}/>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DoctorBookPage;
