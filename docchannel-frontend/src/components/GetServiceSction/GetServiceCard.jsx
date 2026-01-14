import { FaRunning } from "react-icons/fa";

function GetServiceCard({Service,description}) {
  return (
    <>
      <div className="h-44 w-full sm:w-64 md:w-[270px] rounded-2xl bg-white shadow-lg flex flex-col justify-center p-3 gap-2">
        <FaRunning color="#72A6BB" size={35} />
        <h1 className="font-nunito font-bold text-wrap">{Service}</h1>
        <p className="font-nunito font-normal text-sm text-wrap">
          {description}
        </p>
      </div>
    </>
  );
}

export default GetServiceCard;
