function DoctorInput({ type, placeHolder, value, Onchange }) {
  return (
    <>
      <input
        type={type}
        placeholder={placeHolder}
        value={value}
        onChange={Onchange}
        className="w-full bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition"
      />
    </>
  );
}

export default DoctorInput;
