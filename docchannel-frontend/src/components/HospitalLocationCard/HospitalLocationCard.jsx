function HospitalLocationCard({ HospitalName, HospitalCity }) {
  return (
    <>
      <div className="flex justify-start items-center bg-[#D9D9D9] w-full rounded-lg">
        <div className="flex flex-col sm:flex-row p-2 sm:p-3 gap-1 sm:gap-0">
          <span className="font-nunito font-light text-sm sm:text-base">
            {HospitalName}
          </span>
          <span className="hidden sm:inline">&nbsp;-&nbsp;</span>
          <span className="font-nunito font-light text-sm sm:text-base">
            {HospitalCity}
          </span>
        </div>
      </div>
    </>
  );
}

export default HospitalLocationCard;
