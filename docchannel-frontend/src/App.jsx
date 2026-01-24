import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import DoctorList from "./pages/DoctorList";
import { AuthProvider } from "./context/AuthContext";
import DoctorBookPage from "./pages/DoctorBookPage";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <>
    <AuthProvider>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignUp />} />
        <Route path="/searchdoc" element={<DoctorList/>} />
        <Route path="/docbook" element={<DoctorBookPage/>} />
        <Route path="/profile" element={<UserProfile/>} />
      </Routes>
      {/* <SignUp/> */}
      {/* <DoctorList/> */}
      {/* <DoctorBookPage/> */}
      {/* <UserProfile/> */}
      </AuthProvider>
    </>
  );
}

export default App;
