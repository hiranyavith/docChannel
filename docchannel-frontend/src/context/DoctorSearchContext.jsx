import { createContext, useContext, useState } from "react";

const DoctorSearchContext = createContext();

export const useDoctorSearch = () => {
  const context = useContext(DoctorSearchContext);
  if (!context) {
    throw new Error("useDoctorSearch must be used within DoctorSearchProvider");
  }
  return context;
};

export const DoctorSearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    doctorName: "",
    specialization: "",
    date: ""
  });

  return (
    <DoctorSearchContext.Provider value={{ searchParams, setSearchParams }}>
      {children}
    </DoctorSearchContext.Provider>
  );
};