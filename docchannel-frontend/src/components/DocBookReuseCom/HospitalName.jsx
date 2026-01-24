function HospitalNameCard({HospitalName, HospitalLocation}) {
  return (
    <>
      <div className="flex items-center justify-start p-2 bg-[#D9D9D9] border rounded-[12px]">
        <span className="font-nunito font-light">{HospitalName}</span>
        &nbsp;-&nbsp;
        <span className="font-nunito font-light">{HospitalLocation}</span>
      </div>
    </>
  );
}

export default HospitalNameCard;
