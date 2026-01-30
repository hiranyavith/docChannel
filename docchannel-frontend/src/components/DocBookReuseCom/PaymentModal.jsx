import { useEffect } from "react";

function PaymentModal({ paymentData, onSuccess, onErr, onDismiss }) {
  useEffect(() => {
    if (paymentData && window.payhere) {
      initiatePayment();
    }
  }, [paymentData]);

  const initiatePayment = () => {
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
      custom_2: paymentData.custom_2
    };

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

    window.payhere.startPayment(payment);
  };

  return null;
}

export default PaymentModal;