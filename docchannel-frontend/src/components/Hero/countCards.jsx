function CountCards({ count, label }) {
  return (
    <div className="flex flex-col items-center text-center pointer-events-auto bg-white/90 md:bg-transparent rounded-xl p-4 md:p-0 shadow-sm md:shadow-none min-w-[120px]">
      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold font-nunito text-gray-900">
        {count}+
      </h1>
      <p className="text-gray-700 font-nunito text-xs md:text-sm mt-1">
        {label}
      </p>
    </div>
  );
}

export default CountCards;