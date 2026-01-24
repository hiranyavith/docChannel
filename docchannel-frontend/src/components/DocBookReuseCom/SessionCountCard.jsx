function SessionCountCard({Speciality, SessionCount}) {
  return (
    <>
      <div className="flex flex-col gap-1 items-center justify-start p-3">
        <span className="font-nunito font-bold">{Speciality}</span>
        <span className="font-nunito font-light">{SessionCount} Sessions</span>
      </div>
    </>
  );
}

export default SessionCountCard;
