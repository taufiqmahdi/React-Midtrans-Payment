import React from "react";
import { useMidtrans } from "../hooks/useMidtrans";

// In a real app, these would come from your cart / order state
const ORDER_PAYLOAD = {
  order_id: `ORDER-${Date.now()}`,   // must be unique per transaction
  amount: 150000,                     // IDR 150,000
  customer_name: "Budi Santoso",
  customer_email: "budi@example.com",
  customer_phone: "08123456789",
  items: [
    { id: "ITEM-1", name: "Kaos Polos", price: 75000, quantity: 1 },
    { id: "ITEM-2", name: "Celana Chino", price: 75000, quantity: 1 },
  ],
};

export function CheckoutButton() {
  const { pay, status, result, error, reset } = useMidtrans();

  if (status === "success") {
    return (
      <div style={{ padding: 20, border: "1px solid green", borderRadius: 8 }}>
        <h3>✅ Payment Successful!</h3>
        <p>Order ID: {result?.orderId}</p>
        <p>Method: {result?.paymentType}</p>
        <button onClick={reset}>Make Another Payment</button>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div style={{ padding: 20, border: "1px solid orange", borderRadius: 8 }}>
        <h3>⏳ Payment Pending</h3>
        <p>Order ID: {result?.orderId}</p>
        <p>Please complete payment via {result?.paymentType}</p>
        <button onClick={reset}>Back</button>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}
      <button
        onClick={() => pay(ORDER_PAYLOAD)}
        disabled={status === "loading"}
        style={{
          padding: "12px 24px",
          fontSize: 16,
          backgroundColor: status === "loading" ? "#ccc" : "#0A3D62",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: status === "loading" ? "not-allowed" : "pointer",
        }}
      >
        {status === "loading" ? "Processing..." : "Pay IDR 150.000"}
      </button>
    </div>
  );
}