import male_doc from "../../assets/img/doc_male.svg";
import { FaRunning } from "react-icons/fa";
import GetServiceButton from "./GetServiceButton";
import GetServiceCard from "./GetServiceCard";

function GetServiceSection() {
  return (
    <>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-12">
          <div className="flex flex-col gap-6 md:gap-8 text-center md:text-left">
            <h1 className=" py-8 font-nunito text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Sri Lanka’s Best Healthcare
              <br className="hidden md:block" />
              Services for you and your loved ones
            </h1>

            <div className="inline-flex items-center justify-center md:justify-start">
              <GetServiceButton />
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-wrap gap-6 w-full md:w-auto">
            <GetServiceCard
              Service={"Cardiology"}
              description={"Cardiologists specialize in diagnosing and treating"}
            />
            <GetServiceCard
              Service={"Cardiology"}
              description={"Cardiologists specialize in diagnosing and treating"}
            />
            <GetServiceCard
              Service={"Cardiology"}
              description={"Cardiologists specialize in diagnosing and treating"}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end items-end">
        <img
          src={male_doc}
          alt="Male Doctor"
          className="self-end w-[370px] object-contain"
        />
      </div>
    </>
  );
}

export default GetServiceSection;
