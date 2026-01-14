import { FaPlayCircle } from "react-icons/fa";

function HeroButton({ text }) {
  return (
    <button className="flex flex-row items-center gap-2 bg-[#72A6BB] text-[#ffffff] px-5 py-2 rounded-full font-bold hover:bg-[#5B9AA8] transition font-nunito w-fit">
      {text}
      <FaPlayCircle size={30}/>
    </button>
  );
}

export default HeroButton;