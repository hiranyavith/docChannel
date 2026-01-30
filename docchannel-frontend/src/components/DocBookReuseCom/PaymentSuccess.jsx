import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [appointment, setAppointment] = useState(null);

  const orderId = searchParams.get("order_id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    }
  }, [orderId]);

  const verifyPayment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/appointments/verify-payment/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setAppointment(response.data.appointment);
      }
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-nunito text-xl">Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="font-nunito font-bold text-2xl text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="font-nunito text-gray-600 mb-6">
          Your appointment has been confirmed.
        </p>

        {appointment && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="font-nunito text-sm mb-2">
              <strong>Appointment #:</strong> {appointment.appointment_number}
            </p>
            <p className="font-nunito text-sm mb-2">
              <strong>Doctor:</strong> Dr. {appointment.doctor_name}
            </p>
            <p className="font-nunito text-sm mb-2">
              <strong>Date:</strong> {new Date(appointment.available_date).toLocaleDateString()}
            </p>
            <p className="font-nunito text-sm">
              <strong>Queue Number:</strong> {appointment.queue_number}
            </p>
          </div>
        )}

        <button
          onClick={() => navigate("/my-appointments")}
          className="w-full bg-[#72A6BB] text-white font-nunito font-bold py-3 rounded-lg hover:bg-[#5a8a9d] transition"
        >
          View My Appointments
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;