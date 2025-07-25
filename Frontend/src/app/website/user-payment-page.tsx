import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RazorpayPaymentModal from "@/components/custom/RazorpayPaymentModal";
import axios from "axios";

export default function UserPaymentPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateOrder = async () => {
    setLoading(true);
    setError("");
    try {
      // Example: 499 INR
      const amount = 499 * 100;
      const res = await axios.post("http://localhost:8000/payment/order", {
        amount,
        currency: "INR",
        receipt: "user_payment_" + Date.now(),
      });
      // Adjust for your backend response structure
      const data = res.data.data || res.data;
      setOrder({
        orderId: data.id,
        amount: data.amount,
        currency: data.currency,
        razorpayKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "<YOUR_KEY_ID>",
      });
    } catch (err: any) {
      setError("Failed to create payment order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">User Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Pay securely using Razorpay. Click below to proceed.
          </p>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {!order ? (
            <Button onClick={handleCreateOrder} loading={loading} className="w-full">
              {loading ? "Loading..." : "Pay ₹499"}
            </Button>
          ) : (
            <div className="flex justify-center">
              <RazorpayPaymentModal
                orderId={order.orderId}
                amount={order.amount}
                currency={order.currency}
                razorpayKey={order.razorpayKey}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 