import { useEffect } from "react";

function PaymentModal({ paymentData, onSuccess, onErr, onDismiss }) {
  useEffect(() => {
    console.log("PaymentModal mounted with data:", paymentData);
    if (!window.payhere) {
      console.error("PayHere SDK not loaded!");
      onErr("PayHere payment gateway not loaded. Please refresh the page.");
      return;
    }

    if (paymentData) {
      console.log("Initiating PayHere payment...");
      initiatePayment();
    }
  }, [paymentData]);

  const initiatePayment = () => {
    try {
      const payment = {
        sandbox: paymentData.payhereMode === "sandbox",
        merchant_id: paymentData.merchant_id,
        return_url: paymentData.return_url,
        cancel_url: paymentData.cancel_url,
        notify_url: paymentData.notify_url,
        order_id: paymentData.order_id,
        items: paymentData.items,
        amount: paymentData.amount,
        currency: paymentData.currency,
        first_name: paymentData.first_name,
        last_name: paymentData.last_name,
        email: paymentData.email,
        phone: paymentData.phone,
        address: paymentData.address,
        city: paymentData.city,
        country: paymentData.country,
        hash: paymentData.hash,
        custom_1: paymentData.custom_1,
        custom_2: paymentData.custom_2,
      };

      console.log("Payment object prepared:", payment);

      window.payhere.onCompleted = function onCompleted(orderId) {
        console.log("Payment completed. OrderID:" + orderId);
        onSuccess(orderId);
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log("Payment dismissed");
        onDismiss();
      };

      window.payhere.onError = function onError(error) {
        console.log("Error:" + error);
        onErr(error);
      };
      console.log("Starting PayHere payment...");
      window.payhere.startPayment(payment);
    } catch (error) {
      console.error("Error initiating payment:", error);
      onErr(error.message || "Failed to initiate payment");
    }
  };

  return null;
}

export default PaymentModal;
