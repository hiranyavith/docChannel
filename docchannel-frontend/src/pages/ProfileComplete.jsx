import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderDocChannel from "../components/HeaderDocChannel/HeaderDocChannel";
import Dropdown from "../components/DocBookReuseCom/Dropdown";

function ProfileComplete() {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState(null);
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileCode: "+94",
    mobileNumber: "",
    nicNo: "",
    address: "",
    city: "",
    district: "",
    province: "",
    gender: "",
    dob: "",
  });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  //OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Get signup data from sessionStorage
    const storedData = sessionStorage.getItem("signupData");

    if (!storedData) {
      // If no signup data, redirect to signup
      navigate("/signup");
      return;
    }
    const parsedData = JSON.parse(storedData);
    setSignupData(parsedData);

    // Pre-fill full name if available
    if (parsedData.fullName) {
      const nameParts = parsedData.fullName.split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
      }));
    }
  }, [navigate]);

  useEffect(() => {
    let interval;
    if (showOtpModal && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, resendTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{9,10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Invalid mobile number";
    }

    if (!formData.nicNo.trim()) {
      newErrors.nicNo = "NIC number is required";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/user/complete-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: signupData.userId,
            ...formData,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to complete profile");
      }

      await sendOtpToEmail();

      setShowOtpModal(true);
      setResendTimer(120);
      setCanResend(false);

      // Clear signup data from sessionStorage
      // sessionStorage.removeItem("signupData");

      // Show success message and redirect to login
      // alert("Profile completed successfully! Please login to continue.");

      // setTimeout(() => {
      //   navigate("/login"); // Redirect to login (sign in mode)
      // }, 1500);
    } catch (error) {
      setError((prev) => ({
        ...prev,
        submit: error.message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtpToEmail = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/send-verification-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: signupData.userId,
            email: signupData.email,
          }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP: ", error);
      throw error;
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index - 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key == "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setOtpError("Please emter complete OTP");
      return;
    }
    setIsVerifying(true);
    setOtpError("");
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/verify-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: signupData.userId,
            otp: otpString,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      sessionStorage.removeItem("singupData");

      alert("Account verified successfully! Please login to continue.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      await sendOtpToEmail();
      setResendTimer(120);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setOtpError("");
      alert("OTP has been resent to your email");
    } catch (error) {
      setOtpError("Failed to resend OTP. Please Try Again", error);
    }
  };

  // const handleSkip = () => {
  //   if (
  //     window.confirm(
  //       "Are you sure you want to skip profile completion? You can complete it later from your profile page.",
  //     )
  //   ) {
  //     sessionStorage.removeItem("signupData");
  //     navigate("/signup");
  //   }
  // };

  if (!signupData) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="p-3 sm:p-4 md:p-6">
        <HeaderDocChannel Title={"Complete Your Profile"} />

        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-nunito text-gray-800">
                Welcome, {signupData.fullName}!
              </h2>
              <p className="text-gray-600 font-nunito mt-2">
                Please complete your profile to get started
              </p>
            </div>

            {error.submit && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error.submit}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-xl font-bold font-nunito mb-4">
                  Personal Information
                </h3>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-nunito font-semibold">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none ${
                        error.firstName ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="John"
                    />
                    {error.firstName && (
                      <span className="text-red-500 text-sm">
                        {error.firstName}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-nunito font-semibold">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none ${
                        error.lastName ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="Doe"
                    />
                    {error.lastName && (
                      <span className="text-red-500 text-sm">
                        {error.lastName}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-nunito font-semibold">
                      Mobile *
                    </label>
                    <div className="flex flex-row gap-3">
                      <input
                        type="text"
                        name="mobileCode"
                        value={formData.mobileCode}
                        onChange={handleInputChange}
                        className="bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none w-20"
                        placeholder="+94"
                      />
                      <input
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        className={`bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none flex-1 ${
                          error.mobileNumber ? "ring-2 ring-red-500" : ""
                        }`}
                        placeholder="712345678"
                      />
                    </div>
                    {error.mobileNumber && (
                      <span className="text-red-500 text-sm">
                        {error.mobileNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-nunito font-semibold">
                      NIC Number *
                    </label>
                    <input
                      type="text"
                      name="nicNo"
                      value={formData.nicNo}
                      onChange={handleInputChange}
                      className={`bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none ${
                        error.nicNo ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="123456789V"
                    />
                    {error.nicNo && (
                      <span className="text-red-500 text-sm">
                        {error.nicNo}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Dropdown
                      label="Gender"
                      type="genders"
                      value={gender}
                      OnChange={(e) => {
                        setGender(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }));
                      }}
                    />
                    {error.gender && (
                      <span className="text-red-500 text-sm">
                        {error.gender}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-nunito font-semibold">
                      Birth Of Date *
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className={`bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none ${
                        error.dob ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="123456789V"
                    />
                    {error.dob && (
                      <span className="text-red-500 text-sm">{error.dob}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-6">
                <h3 className="text-xl font-bold font-nunito mb-4">
                  Address Information
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-nunito font-semibold">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className={`bg-[#D9D9D9] p-2 rounded-lg font-nunito font-medium focus:outline-none ${
                        error.address ? "ring-2 ring-red-500" : ""
                      }`}
                      placeholder="Enter your full address"
                    />
                    {error.address && (
                      <span className="text-red-500 text-sm">
                        {error.address}
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                    <div className="flex flex-col gap-2">
                      <Dropdown
                        label="City"
                        type="cities"
                        value={city}
                        OnChange={(e) => {
                          setCity(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }));
                        }}
                      />
                      {error.city && (
                        <span className="text-red-500 text-sm">
                          {error.city}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Dropdown
                        label="District"
                        type="district"
                        value={district}
                        OnChange={(e) => {
                          setDistrict(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            district: e.target.value,
                          }));
                        }}
                      />
                      {error.district && (
                        <span className="text-red-500 text-sm">
                          {error.district}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Dropdown
                        label="Province"
                        type="provinces"
                        value={province}
                        OnChange={(e) => {
                          setProvince(e.target.value);
                          setFormData((prev) => ({
                            ...prev,
                            province: e.target.value,
                          }));
                        }}
                      />
                      {error.province && (
                        <span className="text-red-500 text-sm">
                          {error.province}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 bg-[#72A6BB] text-white p-3 rounded-lg font-nunito font-semibold hover:bg-[#5a8a9d] transition ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
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
                  ) : (
                    "Complete Profile"
                  )}
                </button>

                {/* <button
                  type="button"
                  onClick={handleSkip}
                  className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg font-nunito font-semibold hover:bg-gray-400 transition"
                >
                  Skip for Now
                </button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-[#72A6BB] rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold font-nunito text-gray-800 mb-2">
                Verify Your Email
              </h2>
              <p className="text-gray-600 font-nunito">
                We've sent a 6-digit code to
              </p>
              <p className="text-[#72A6BB] font-nunito font-semibold mt-1">
                {signupData.email}
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <div className="flex justify-center gap-2 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#72A6BB] focus:outline-none transition"
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-red-500 text-sm text-center mb-4">
                  {otpError}
                </p>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className={`w-full bg-[#72A6BB] text-white p-3 rounded-lg font-nunito font-semibold hover:bg-[#5a8a9d] transition ${
                  isVerifying ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isVerifying ? (
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
                    Verifying...
                  </span>
                ) : (
                  "Verify Account"
                )}
              </button>
            </div>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-600 font-nunito text-sm mb-2">
                Didn't receive the code?
              </p>
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  className="text-[#72A6BB] font-nunito font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-500 font-nunito text-sm">
                  Resend OTP in {resendTimer}s
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
export default ProfileComplete;
