import { useState, useCallback } from "react";
import { createTransaction } from "../api/payment";
import type { CreateTransactionPayload } from "../api/payment";

type PaymentStatus = "idle" | "loading" | "pending" | "success" | "failed" | "error";

interface PaymentResult {
  orderId: string;
  transactionStatus: string;
  paymentType: string;
}

export function useMidtrans() {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pay = useCallback(async (payload: CreateTransactionPayload) => {
    setStatus("loading");
    setError(null);

    try {
      // 1. Ask your Go backend for a Snap token
      const { snap_token } = await createTransaction(payload);

      // 2. Open the Midtrans popup with the token
      window.snap.pay(snap_token, {
        onSuccess: (result) => {
          setStatus("success");
          setResult({
            orderId: result.order_id,
            transactionStatus: result.transaction_status,
            paymentType: result.payment_type,
          });
        },

        onPending: (result) => {
          setStatus("pending");
          setResult({
            orderId: result.order_id,
            transactionStatus: result.transaction_status,
            paymentType: result.payment_type,
          });
        },

        onError: (result) => {
          setStatus("failed");
          setError(`Payment failed: ${result.transaction_status}`);
        },

        onClose: () => {
          // User closed the popup without paying
          if (status === "loading") {
            setStatus("idle");
          }
        },
      });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
    }
  }, [status]);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return { pay, status, result, error, reset };
}