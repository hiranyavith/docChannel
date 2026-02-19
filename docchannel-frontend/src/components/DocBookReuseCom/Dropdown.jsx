import axios from "axios";
import { useEffect, useState } from "react";

function Dropdown({ label, type, value, OnChange, disabled = false }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let url = `${import.meta.env.VITE_API_URL}/api/dropdowns/${type}`;
    axios.get(url).then((res) => setOptions(res.data));
  }, [type]);
  return (
    <>
      <label htmlFor="">{label}</label>
      <select
        value={value}
        onChange={OnChange}
        disabled={disabled}
        className="bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none"
      >
        <option>Select {label}</option>
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </>
  );
}

export default Dropdown;
