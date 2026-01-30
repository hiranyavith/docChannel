import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
        <h1 className="font-nunito font-bold text-2xl text-red-600 mb-2">
          Payment Cancelled
        </h1>
        <p className="font-nunito text-gray-600 mb-6">
          Your payment was cancelled. No charges were made.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-[#72A6BB] text-white font-nunito font-bold py-3 rounded-lg hover:bg-[#5a8a9d] transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/searchdoc")}
            className="w-full bg-gray-200 text-gray-700 font-nunito font-bold py-3 rounded-lg hover:bg-gray-300 transition"
          >
            Back to Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentCancel;