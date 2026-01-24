import { FaArrowCircleRight } from "react-icons/fa";

function GetServiceButton() {
  return (
    <>
      <button className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 font-rubik font-bold text-lg md:text-xl text-black shadow-md transition hover:bg-gray-50 hover:shadow-lg active:scale-95">
        Get Services
        <FaArrowCircleRight className="text-2xl md:text-3xl transition group-hover:translate-x-1" />
      </button>
    </>
  );
}

export default GetServiceButton;
