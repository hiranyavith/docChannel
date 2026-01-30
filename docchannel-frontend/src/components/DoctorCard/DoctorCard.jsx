import { MdPerson } from "react-icons/md";
import { LuStethoscope } from "react-icons/lu";
import {
  FaCalendarAlt,
  FaClock,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function DoctorCard({
  doctorId,
  DoctorName,
  Speciality,
  SpecialNote,
  schedules,
}) {
  const navigate = useNavigate();
  const [showSchedules, setShowSchedules] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleBookAppointment = (scheduleId) => {
    if (!scheduleId && schedules && schedules.length > 0) {
      setShowSchedules(true);
      return;
    }

    if (!scheduleId) {
      alert("No schedules available for this doctor at the moment.");
      return;
    }

    navigate("/docbook", {
      state: {
        doctorId,
        scheduleId,
        doctorName: DoctorName,
        speciality: Speciality,
      },
    });
  };

  return (
    <div className="flex flex-col bg-[#D9D9D9]/55 border-l-[#72A6BB] border-l-4 sm:border-l-5 rounded-sm overflow-hidden">
      {/* Main Doctor Info */}
      <div className="flex flex-col sm:flex-row justify-around items-center gap-3 sm:gap-4 p-3 sm:p-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-[100px] md:h-[100px] bg-[#D9D9D9] flex justify-center items-center rounded-lg flex-shrink-0 overflow-hidden">
          <MdPerson className="w-full h-full" color="white" />
        </div>

        <div className="flex flex-col gap-1 sm:gap-2 justify-center text-center sm:text-left flex-1">
          <span className="font-nunito font-bold text-[#BB7272] text-sm sm:text-base md:text-lg">
            DR. {DoctorName?.toUpperCase()}
          </span>
          <span className="font-nunito font-semibold text-xs sm:text-sm md:text-base">
            {Speciality?.toUpperCase()}
          </span>
          {SpecialNote && (
            <span className="font-nunito text-xs sm:text-sm text-gray-600 mt-1">
              {SpecialNote}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 justify-center w-full sm:w-auto">
          {schedules && schedules.length > 0 ? (
            <>
              <button
                onClick={() => handleBookAppointment(null)}
                className="flex items-center justify-center gap-2 font-nunito font-semibold bg-[#72A6BB] px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md text-white text-xs sm:text-sm md:text-base hover:bg-[#5a8a9d] active:bg-[#4a7a8d] transition whitespace-nowrap w-full sm:w-auto"
              >
                <LuStethoscope size={25} />
                Channel Doctor
              </button>

              {/* Toggle Schedules Button */}
              <button
                onClick={() => setShowSchedules(!showSchedules)}
                className="flex items-center justify-center gap-2 font-nunito font-semibold bg-white border-2 border-[#72A6BB] px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md text-[#72A6BB] text-xs sm:text-sm md:text-base hover:bg-gray-50 transition whitespace-nowrap w-full sm:w-auto"
              >
                {showSchedules ? (
                  <FaChevronUp size={16} />
                ) : (
                  <FaChevronDown size={16} />
                )}
                {showSchedules ? "Hide" : "View"} Schedules ({schedules.length})
              </button>
            </>
          ) : (
            <div className="text-center font-nunito text-sm text-gray-600 py-2">
              No schedules available
            </div>
          )}
        </div>
      </div>

      {/* Schedules Section - Collapsible */}
      {showSchedules && schedules && schedules.length > 0 && (
        <div className="border-t-2 border-[#72A6BB]/30 bg-white/50 p-3 sm:p-4">
          <h3 className="font-nunito font-bold text-[#72A6BB] mb-3 text-sm sm:text-base">
            Available Schedules:
          </h3>
          <div className="space-y-2">
            {schedules.map((schedule) => (
              <div
                key={schedule.schedule_id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 bg-white rounded-lg border border-[#72A6BB]/20 hover:border-[#72A6BB]/50 transition"
              >
                {/* Date and Time Info */}
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt
                      className="text-[#72A6BB] flex-shrink-0"
                      size={14}
                    />
                    <span className="font-nunito text-xs sm:text-sm font-semibold">
                      {formatDate(schedule.available_date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaClock
                      className="text-[#72A6BB] flex-shrink-0"
                      size={14}
                    />
                    <span className="font-nunito text-xs sm:text-sm">
                      {formatTime(schedule.start_time)} -{" "}
                      {formatTime(schedule.end_time)}
                    </span>
                  </div>
                </div>

                {/* Slots Available */}
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="flex flex-col items-start sm:items-end">
                    <span className="font-nunito text-xs text-gray-600">
                      Available Slots
                    </span>
                    <span className="font-nunito text-sm sm:text-base font-bold text-green-600">
                      {schedule.slots_available} / {schedule.max_appointments}
                    </span>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleBookAppointment(schedule.schedule_id)}
                    disabled={schedule.slots_available === 0}
                    className={`font-nunito font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm transition whitespace-nowrap ${
                      schedule.slots_available === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#72A6BB] text-white hover:bg-[#5a8a9d] active:bg-[#4a7a8d]"
                    }`}
                  >
                    {schedule.slots_available === 0
                      ? "Fully Booked"
                      : "Book Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Schedules Available */}
      {(!schedules || schedules.length === 0) && (
        <div className="border-t-2 border-[#72A6BB]/30 bg-white/50 p-3 sm:p-4">
          <p className="font-nunito text-sm text-gray-600 text-center">
            No schedules available at the moment
          </p>
        </div>
      )}
    </div>
  );
}

export default DoctorCard;
