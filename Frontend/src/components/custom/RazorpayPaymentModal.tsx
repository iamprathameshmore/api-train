import React from "react";

interface RazorpayProps {
  orderId: string;
  amount: number;
  currency: string;
  razorpayKey: string;
}

const RazorpayPaymentModal: React.FC<RazorpayProps> = ({
  orderId,
  amount,
  currency,
  razorpayKey,
}) => {
  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  React.useEffect(() => {
    loadRazorpay();
  }, []);

  const openCheckout = () => {
    const options = {
      key: razorpayKey,
      amount: amount,
      currency: currency,
      name: "Your App",
      description: "Test Transaction",
      order_id: orderId,
      handler: function (response: any) {
        alert("Payment Success!");
        console.log(response); // you can POST this to backend to verify
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={openCheckout}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Pay ₹{amount / 100}
    </button>
  );
};

export default RazorpayPaymentModal;

