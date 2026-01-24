function DoctorSelect({ options, placeholder, value, onChange, name }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="flex-1 bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition cursor-pointer
      [&>option]:text-gray-900 [&>option]:bg-white"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default DoctorSelect;