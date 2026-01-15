import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignUp />} />
      </Routes>
      {/* <SignUp/> */}
    </>
  );
}

export default App;
