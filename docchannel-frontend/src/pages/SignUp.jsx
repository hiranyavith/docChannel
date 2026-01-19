import { useState } from "react";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import HeaderDocChannel from "../components/HeaderDocChannel/HeaderDocChannel";

function SignUp() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <>
      <div className="py-12 px-8">
        <HeaderDocChannel/>
        <div className="flex flex-col justify-center items-center mt-12 p-8 max-w-md mx-auto">
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-8 bg-gray-100 rounded-full p-1 w-full">
            <button
              onClick={() => setIsSignIn(true)}
              className={`flex-1 py-2 rounded-full font-semibold transition ${
                isSignIn
                  ? "bg-[#72A6BB] text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`flex-1 py-2 rounded-full font-semibold transition ${
                !isSignIn
                  ? "bg-[#72A6BB] text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="w-full flex flex-col gap-5">
            {!isSignIn && (
              <div className="flex flex-col">
                <label className="font-nunito font-bold text-black mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full bg-[#D9D9D9] backdrop-blur-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#72A6BB] transition"
                />
              </div>
            )}

            <div className="flex flex-col">
              <label className="font-nunito font-bold text-black mb-2">
                Email Or Username
              </label>
              <input
                type="text"
                className="w-full bg-[#D9D9D9] backdrop-blur-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#72A6BB] transition"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-nunito font-bold text-black mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-[#D9D9D9] backdrop-blur-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#72A6BB] transition"
              />
            </div>

            {!isSignIn && (
              <div className="flex flex-col">
                <label className="font-nunito font-bold text-black mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full bg-[#D9D9D9] backdrop-blur-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#72A6BB] transition"
                />
              </div>
            )}
            {isSignIn && (
              <div className="flex flex-row justify-between px-2">
                <div className="flex items-center">
                  <input
                    id="checked-checkbox"
                    type="checkbox"
                    className="w-4 h-4 border rounded-sm focus:ring-2 focus:ring-[#72A6BB]"
                  />
                  <label
                    htmlFor="checked-checkbox"
                    className="font-nunito font-semibold ms-2 md:text-[20px] text-[15px]"
                  >
                    Remember Me
                  </label>
                </div>
                <span className="font-nunito text-[#72A6BB] font-semibold cursor-pointer hover:underline md:text-[20px] text-[15px]">
                  Forgot Password
                </span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button className="w-full bg-[#B1CED9] p-4 rounded-2xl font-nunito text-lg font-semibold hover:bg-[#9bb9c4] transition">
                {isSignIn ? "Sign In" : "Sign Up"}
              </button>
              <div className="flex flex-row justify-around items-center">
                <hr className="border border-black w-full m-2" />
                <span>&nbsp; Or &nbsp;</span>
                <hr className="border border-black w-full m-2" />
              </div>
              <div className="flex flex-row items-center gap-3">
                <button className="w-full p-4 rounded-2xl font-nunito text-lg font-semibold hover:bg-[#e4e6e7] transition border border-black flex flex-row items-center justify-center gap-5">
                  <FcGoogle />
                  {isSignIn ? "Sign In With Google" : "Sign Up With Google"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
}

export default SignUp;
