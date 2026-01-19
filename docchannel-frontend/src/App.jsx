import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import DoctorList from "./pages/DoctorList";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignUp />} />
        <Route path="/searchdoc" element={<DoctorList/>} />
      </Routes>
      {/* <SignUp/> */}
      {/* <DoctorList/> */}
    </>
  );
}

export default App;
