import { FaCircle } from "react-icons/fa";
import CountCards from "./countCards";

function HeroSectionTwo() {
  return (
    // 1. Removed absolute positioning props (bottom/right)
    // 2. Removed pointer-events-none (unless you specifically don't want clicks)
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid for Mobile, Flex for Desktop */}
        <div className="grid grid-cols-2 gap-8 md:flex md:flex-row md:justify-around items-center">
          
          <CountCards count={100} label={"Satisfied Patients"} />
          <CountCards count={1000} label={"Satisfied Patients"} />
          <CountCards count={5000} label={"Satisfied Patients"} />
          <CountCards count={500} label={"Satisfied Patients"} />
          
        </div>
      </div>
    </div>
  );
}

export default HeroSectionTwo;