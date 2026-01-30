import { FaBookmark } from "react-icons/fa";

function AppointmentCard({ActiveAppointmentCount, Date, Time, AppointmentStatus, Fee}){
    return (
        <>
        <div className="flex flex-col items-center md:items-start">
              <span className="font-nunito font-light">{Date}</span>
              <span className="font-nunito font-bold">{Time}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-nunito font-light">
                Active Appointments
              </span>
              <span className="font-nunito font-bold">{ActiveAppointmentCount}</span>
            </div>
            {/* <div className="flex"> */}
            <div className="flex flex-row gap-2 bg-[#72A6BB] items-center justify-center px-5 rounded-lg w-full md:w-fit">
              <FaBookmark color="white" />
              <button className="font-nunito font-bold text-white p-3">
                Book
              </button>
            </div>
            {/* </div> */}
            <div className="flex flex-col">
              <span className="font-nunito font-bold">Rs. {Fee}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-nunito font-bold">{AppointmentStatus}</span>
            </div>
        </>
    )
}

export default AppointmentCard;