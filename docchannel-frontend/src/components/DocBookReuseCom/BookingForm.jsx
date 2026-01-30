import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import PaymentModal from "./PaymentModal";

function BookingForm({ scheduleId, doctorId }) {
  const navigate = useNavigate();
  //   const [formData, setFormData] = useState({
  //     patientName: "",
  //     patientEmail: "",
  //     patientPhone: "",
  //     patientAge: "",
  //     patientGender: "",
  //   });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const { token, isAuthenticated, user } = useAuth();

  //   const handleChange = (e) => {
  //     setFormData({
  //       ...formData,
  //       [e.target.name]: e.target.value,
  //     });
  //   };
  useEffect(() => {
    console.log("Auth Status:", {
      isAuthenticated,
      hasToken: !!token,
      user: user?.f_name || "No user",
    });

    if (!isAuthenticated || !token) {
      setError("You must be logged in to book an appointment");
    }
  }, [isAuthenticated, token, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("You must be logged in to book an appointment");
      navigate("/login");
      return;
    }

    if (!scheduleId) {
      setError("Invalid schedule. Please select a schedule again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Submitting booking:", {
        scheduleId,
        token: token ? "Present" : "Missing",
        tokenLength: token?.length,
      });
      const response = await axios.post(
        // "http://localhost:5000/api/appointments/create",
        "http://localhost:5000/api/appointments/initiate-payment",
        {
          scheduleId,
          doctorId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Payment initiation response:", response.data);
      if (response.data.success) {
        setPaymentData(response.data.paymentData);
        console.log("PayHere payment data set:", response.data.paymentData);
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setError(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (orderId) => {
    console.log("Payment completed successfully, order ID:", orderId);
    setLoading(true);
    try {
      // Verify payment status
      const response = await axios.get(
        `http://localhost:5000/api/appointments/verify-payment/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        alert("Payment successful! Your appointment is confirmed.");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      setError(
        "Payment completed but verification failed. Please contact support.",
      );
    } finally {
      setLoading(false);
      setPaymentData(null);
    }
  };

  const handlePaymentError = (err) => {
    console.error("Payment error:", err);
    setError("Payment failed. Please try again.");
    setPaymentData(null);
    setLoading(false);
  };

  const handlePaymentDismiss = () => {
    console.log("Payment dismissed by user");
    setError("Payment was cancelled.");
    setPaymentData(null);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="font-nunito font-bold text-2xl text-[#72A6BB] mb-6">
        Book Your Appointment
      </h2>

      {!isAuthenticated && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
          <p className="font-semibold">⚠️ Not Logged In</p>
          <p className="text-sm mt-1">
            You must be logged in to book an appointment.{" "}
            <button
              onClick={() => navigate("/login")}
              className="underline font-semibold hover:text-yellow-900"
            >
              Click here to log in
            </button>
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="font-nunito text-sm text-blue-800">
          <strong>Note:</strong> You will be redirected to PayHere payment
          gateway to complete your payment securely.
        </p>
      </div>
      <button
        onClick={(e) => handleSubmit(e)}
        disabled={loading}
        className={`w-full font-nunito font-bold py-3 rounded-lg transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#72A6BB] hover:bg-[#5a8a9d] text-white"
        }`}
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
      {paymentData && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 rounded text-xs">
          <p className="font-semibold text-green-800">
            ✓ Payment data received. Opening PayHere...
          </p>
        </div>
      )}
      {paymentData && (
        <PaymentModal
          paymentData={paymentData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onDismiss={handlePaymentDismiss}
        />
      )}
    </div>
  );
}

export default BookingForm;
