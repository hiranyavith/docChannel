import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import DoctorList from "./pages/DoctorList";
import { AuthProvider } from "./context/AuthContext";
import DoctorBookPage from "./pages/DoctorBookPage";
import UserProfile from "./pages/UserProfile";
import ProfileComplete from "./pages/ProfileComplete";
import PaymentSuccess from "./components/DocBookReuseCom/PaymentSuccess";
import PaymentCancel from "./components/DocBookReuseCom/PaymentCancel";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignUp />} />
          <Route path="/searchdoc" element={<DoctorList />} />
          <Route path="/docbook" element={<DoctorBookPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/profile-complete" element={<ProfileComplete />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
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
