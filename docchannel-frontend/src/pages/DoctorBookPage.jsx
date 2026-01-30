import Footer from "../components/Footer/Footer";
import HeaderDocChannel from "../components/HeaderDocChannel/HeaderDocChannel";
import HospitalNameCard from "../components/DocBookReuseCom/HospitalName";
import DoctorCard from "../components/DocBookReuseCom/DoctorCard";
import SessionCountCard from "../components/DocBookReuseCom/SessionCountCard";
import AppointmentCard from "../components/DocBookReuseCom/AppointmentCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookingForm from "../components/DocBookReuseCom/BookingForm";
import { useAuth } from "../context/AuthContext";

function DoctorBookPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctorId, scheduleId } = location.state || {};
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  useEffect(() => {
    if (!doctorId || !scheduleId) {
      console.error("Missing required parameters:", { doctorId, scheduleId });
      setError("Missing booking information. Please select a schedule.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("You must be logged in to book an appointment.");
      setLoading(false);
      return;
    }

    fetchBookingDetails();
  }, [doctorId, scheduleId, token]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching booking details:", { doctorId, scheduleId });
      const response = await axios.get(
        "http://localhost:5000/api/appointments/booking-details",
        {
          params: { doctorId, scheduleId },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setBookingData(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch booking details:", error);

      // FIX: Better error handling
      if (error.response) {
        // Server responded with error
        setError(
          error.response.data?.message ||
            `Server error: ${error.response.status}`,
        );
      } else if (error.request) {
        // Request made but no response
        setError("Cannot connect to server. Please check your connection.");
      } else {
        // Something else happened
        setError(error.message || "Failed to load booking details");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      .toUpperCase();
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-nunito text-xl">Loading booking details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-nunito text-xl text-red-500">{error}</p>
        <button
          onClick={() => navigate("/searchdoc")}
          className="bg-[#72A6BB] text-white px-6 py-2 rounded-md font-nunito"
        >
          Back to Search
        </button>
      </div>
    );
  }

  if (!bookingData) return null;

  const { doctor, schedule } = bookingData;

  return (
    <>
      <div className="p-3 sm:p-4 md:p-6">
        <HeaderDocChannel Title={"DocChannel"} />
        {/* <div className="py-5">
          <HospitalNameCard
            HospitalName={"Lanka Hospital"}
            HospitalLocation={"Homagama"}
          />
        </div> */}
        <div className="flex flex-col md:flex-row items-center bg-[#D9D9D9]/47 shadow-xl/10 p-3 mt-5">
          <DoctorCard
            DoctorName={doctor.initial_with_name}
            Speciality={doctor.speciality_type}
            SpecialNote={doctor.specialNote || "None"}
          />
        </div>
        {/* <div className="py-8">
          <HospitalNameCard
            HospitalName={"Lanka Hospital"}
            HospitalLocation={"Homagama"}
          />
        </div> */}
        <div className="flex flex-col gap-[35px] mt-3">
          <div className="flex bg-[#D9D9D9]/47 border-l-4 rounded-lg">
            <SessionCountCard
              SessionCount={schedule.active_appointments}
              Speciality={doctor.speciality_type}
            />
          </div>
          <div className="flex flex-col md:flex-row md:justify-between justify-center items-center bg-[#D9D9D9]/47 p-3 border-l-4 rounded-sm gap-3">
            <AppointmentCard
              ActiveAppointmentCount={schedule.slots_available}
              Date={formatDate(schedule.appointmentDate)}
              Time={formatTime(schedule.starting_time)}
              AppointmentStatus={"AVAILABLE"}
              Fee={schedule.consultation_fee}
            />
          </div>
        </div>
        <div className="pt-8">
          <BookingForm doctorId={doctorId} scheduleId={scheduleId} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default DoctorBookPage;
