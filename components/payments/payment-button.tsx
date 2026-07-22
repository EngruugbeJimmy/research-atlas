"use client";

import { useState } from "react";
import { CreditCard, Loader2, FlaskConical } from "lucide-react";
import { isPaystackConfigured, payWithPaystack } from "@/lib/payments/paystack";
import { cn } from "@/lib/utils/cn";

interface PaymentButtonProps {
  email: string;
  amountInCents: number;
  currency?: string;
  label: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  disabled?: boolean;
}

export function PaymentButton({
  email,
  amountInCents,
  currency = "USD",
  label,
  metadata,
  onSuccess,
  disabled,
}: PaymentButtonProps) {
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const configured = isPaystackConfigured();

  async function handleRealPayment() {
    setStatus("processing");
    setError(null);
    try {
      const { reference } = await payWithPaystack({ email, amountInCents, currency, metadata });
      const verifyRes = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.verified) {
        onSuccess(reference);
        setStatus("idle");
      } else {
        setError("We couldn't verify that payment. If you were charged, contact support with your reference.");
        setStatus("error");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment was not completed.");
      setStatus("error");
    }
  }

  function handleDemoPayment() {
    setStatus("processing");
    window.setTimeout(() => {
      onSuccess(`demo_${Date.now()}`);
      setStatus("idle");
    }, 700);
  }

  if (!configured) {
    return (
      <div>
        <button
          onClick={handleDemoPayment}
          disabled={disabled || status === "processing"}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-basin-500/40 px-6 py-3 font-medium text-basin-500 transition hover:bg-basin-500/5",
            (disabled || status === "processing") && "opacity-60"
          )}
        >
          {status === "processing" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FlaskConical className="h-4 w-4" />
          )}
          {status === "processing" ? "Simulating payment…" : `${label} (test mode)`}
        </button>
        <p className="mt-2 text-center text-xs text-ink/45 dark:text-paper/45">
          Live payments aren&apos;t configured yet — this simulates a successful charge so you can test the flow. Add a Paystack key to accept real payments.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleRealPayment}
        disabled={disabled || status === "processing"}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-full bg-basin-500 px-6 py-3 font-medium text-paper transition hover:bg-basin-600",
          (disabled || status === "processing") && "opacity-60"
        )}
      >
        {status === "processing" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {status === "processing" ? "Processing…" : label}
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-500">{error}</p>}
    </div>
  );
}
