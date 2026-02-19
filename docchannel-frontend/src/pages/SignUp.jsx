import { useState } from "react";
// import Footer from "../components/Footer/Footer";
// import NavBar from "../components/NavBar/NavBar";
import { FcGoogle } from "react-icons/fc";
// import { useNavigate } from "react-router-dom";
import HeaderDocChannel from "../components/HeaderDocChannel/HeaderDocChannel";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function SignUp() {
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });
  const [error, setError] = useState({});
  const [isloading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isSignIn) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = "Full name must be at least 2 chars";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is reuqired";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please Enter valid email address";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password =
          "Password must contain uppercase, lowercase and number";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.password) {
        newErrors.confirmPassword = "Password and COnfirm Password not match";
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = "Email or username is required";
      }

      if (!formData.password.trim()) {
        newErrors.password = "Password required";
      }
    }

    setError(newErrors);
    return Object.keys(newErrors).length == 0;
  };

  const handleSignUp = async (userData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Registration Failed");
      }

      sessionStorage.setItem(
        "signupData",
        JSON.stringify({
          userId: data.user._id || data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
          isProfileComplete: false,
        }),
      );

      // if (data.token) {
      //   localStorage.setItem("token", data.token);
      //   localStorage.setItem("user", JSON.stringify(data.user));
      // }

      setSuccessMessage(
        "Registration Success! Redirecting to complete your profile...",
      );

      // setIsSignIn(true);

      setTimeout(() => {
        navigate("/profile-complete");
      }, 2000);

      return data;
    } catch (error) {
      throw new Error(error.message || "An error occurred during registration");
    }
  };

  const handleSIgnIn = async (credentials) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login Failed");
      }

      if (data.token) {
        if (credentials.rememberMe) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          login(data.user, data.token, credentials.rememberMe);
        } else {
          sessionStorage.setItem("token", data.token);
          sessionStorage.setItem("user", JSON.stringify(data.user));
          login(data.user, data.token);
        }
      }

      setSuccessMessage("Login success!!!");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      throw new Error(error.message || "An error occured during login");
    }
  };

  // const handleGoogle = async() =>{
  //   window.location.href = "google"
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignIn) {
        await handleSIgnIn(formData);
      } else {
        await handleSignUp(formData);
      }
    } catch (error) {
      setError((prev) => ({
        ...prev,
        submit: error.message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsSignIn(!isSignIn);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    });
    setError({});
    setSuccessMessage("");
  };
  return (
    <>
      <div className="py-12 px-8">
        <HeaderDocChannel Title={"DocChannel"} />
        <div className="flex flex-col justify-center items-center mt-12 p-8 max-w-md mx-auto">
          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-8 bg-gray-100 rounded-full p-1 w-full">
            <button
              onClick={handleToggleMode}
              className={`flex-1 py-2 rounded-full font-semibold transition ${
                isSignIn
                  ? "bg-[#72A6BB] text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={handleToggleMode}
              className={`flex-1 py-2 rounded-full font-semibold transition ${
                !isSignIn
                  ? "bg-[#72A6BB] text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {successMessage && (
            <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {error.submit && (
            <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error.submit}
            </div>
          )}

          <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
            {!isSignIn && (
              <div className="flex flex-col">
                <label className="font-nunito font-bold text-black mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full bg-[#D9D9D9] backdrop-blur-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 ${
                    error.fullName
                      ? "ring-2 ring-red-500"
                      : "focus:ring-[#72A6BB]"
                  } transition`}
                  placeholder="John Doe"
                />
                {error.fullName && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.fullName}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col">
              <label className="font-nunito font-bold text-black mb-2">
                Email
              </label>
              <input
                type="text"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                className={`w-full bg-[#D9D9D9] backdrop-blur-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 ${
                  error.email ? "ring-2 ring-red-500" : "focus:ring-[#72A6BB]"
                } transition`}
                placeholder={
                  isSignIn ? "Email or Username" : "john@example.com"
                }
              />
              {error.email && (
                <span className="text-red-500 text-sm mt-1">{error.email}</span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="font-nunito font-bold text-black mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full bg-[#D9D9D9] backdrop-blur-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 ${
                  error.password
                    ? "ring-2 ring-red-500"
                    : "focus:ring-[#72A6BB]"
                } transition`}
                placeholder="••••••••"
              />
              {error.password && (
                <span className="text-red-500 text-sm mt-1">
                  {error.password}
                </span>
              )}
            </div>
            {!isSignIn && (
              <div className="flex flex-col">
                <label className="font-nunito font-bold text-black mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full bg-[#D9D9D9] backdrop-blur-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 ${
                    error.confirmPassword
                      ? "ring-2 ring-red-500"
                      : "focus:ring-[#72A6BB]"
                  } transition`}
                  placeholder="••••••••"
                />
                {error.confirmPassword && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.confirmPassword}
                  </span>
                )}
              </div>
            )}
            {isSignIn && (
              <div className="flex flex-row justify-between px-2">
                <div className="flex items-center">
                  <input
                    id="checked-checkbox"
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
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
              <button
                type="submit"
                disabled={isloading}
                className={`w-full bg-[#B1CED9] p-4 rounded-2xl font-nunito text-lg font-semibold hover:bg-[#9bb9c4] transition ${
                  isloading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#9bb9c4]"
                }`}
              >
                {isloading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : isSignIn ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </button>
              <div className="flex flex-row justify-around items-center">
                <hr className="border border-black w-full m-2" />
                <span>&nbsp; Or &nbsp;</span>
                <hr className="border border-black w-full m-2" />
              </div>
              <div className="flex flex-row items-center gap-3">
                <button
                  onClick={() => {
                    console.log("Google service implement here");
                  }}
                  className="w-full p-4 rounded-2xl font-nunito text-lg font-semibold hover:bg-[#e4e6e7] transition border border-black flex flex-row items-center justify-center gap-5"
                >
                  <FcGoogle />
                  {isSignIn ? "Sign In With Google" : "Sign Up With Google"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
}

export default SignUp;
