import { useEffect, useRef } from "react";

function PaymentModal({ paymentData, onSuccess, onError, onDismiss }) {
  // 1. Use a ref to track if the payment flow has already started
  const isPaymentStarted = useRef(false);

  useEffect(() => {
    // 2. PREVENT DOUBLE EXECUTION: If already started, stop here.
    if (isPaymentStarted.current) {
      return;
    }
    
    if (!paymentData) {
      console.log("No payment data provided");
      return;
    }

    // Mark as started immediately
    isPaymentStarted.current = true;
    console.log("PaymentModal mounted with data:", paymentData);

    const loadPayHereScript = () => {
      return new Promise((resolve, reject) => {
        // Check if window.payhere exists
        if (window.payhere) {
          console.log("PayHere SDK already loaded");
          resolve();
          return;
        }

        // Check if script tag already exists in DOM (to prevent duplicates)
        const existingScript = document.querySelector('script[src*="payhere.js"]');
        if (existingScript) {
           console.log("PayHere script tag found, waiting for load...");
           existingScript.addEventListener('load', () => resolve());
           return;
        }

        console.log("Loading PayHere SDK...");
        const script = document.createElement('script');
        script.src = paymentData.sandbox 
          ? 'https://sandbox.payhere.lk/lib/payhere.js'
          : 'https://www.payhere.lk/lib/payhere.js';
        script.async = true;
        script.onload = () => {
          console.log("PayHere SDK loaded successfully");
          resolve();
        };
        script.onerror = () => {
          console.error("Failed to load PayHere SDK");
          reject(new Error('Failed to load PayHere SDK'));
        };
        document.head.appendChild(script);
      });
    };

    const initiatePayment = async () => {
      try {
        await loadPayHereScript();

        // Safety check to ensure SDK is actually available
        if (!window.payhere) {
            throw new Error("PayHere SDK loaded but window.payhere is undefined");
        }

        // Prepare payment object
        const payment = {
          sandbox: paymentData.sandbox,
          merchant_id: paymentData.merchant_id,
          return_url: paymentData.return_url || "", // Fallback to empty string
          cancel_url: paymentData.cancel_url || "", // Fallback to empty string
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

        // Set up event handlers
        window.payhere.onCompleted = function(orderId) {
          console.log("Payment completed. OrderID:", orderId);
          onSuccess(orderId);
        };

        window.payhere.onDismissed = function() {
          console.log("Payment dismissed by user");
          onDismiss();
        };

        window.payhere.onError = function(error) {
          console.error("Payment error:", error);
          onError(error);
        };

        console.log("Starting PayHere payment...");
        window.payhere.startPayment(payment);

      } catch (error) {
        console.error("Error initiating payment:", error);
        onError(error.message || "Failed to initiate payment");
      }
    };

    initiatePayment();

    // Cleanup function
    return () => {
       // Optional: You can try to remove handlers, but PayHere is global
       // window.payhere.onCompleted = null;
    };
  }, [paymentData]); // Keep dependency array simple

  return null;
}

export default PaymentModal;