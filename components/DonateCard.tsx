"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, HeartHandshake, Loader2 } from "lucide-react";
import { openPaystackPopup, type SupportedCurrency } from "@/lib/paystack";
import { DonationSuccess } from "@/components/DonationSuccess";

const PRESET_AMOUNTS: Record<SupportedCurrency, number[]> = {
  NGN: [1000, 5000, 10000, 20000],
  USD: [5, 10, 25, 50],
};

const CURRENCY_SYMBOL: Record<SupportedCurrency, string> = {
  NGN: "₦",
  USD: "$",
};

const CURRENCY_PLACEHOLDER: Record<SupportedCurrency, string> = {
  NGN: "e.g. 2,000",
  USD: "e.g. 15",
};

// ─────────────────────────────────────────────────────────────
// Replace this with your real Paystack PUBLIC key via environment
// variables — never hardcode it directly in this file.
//   1. Copy .env.example to .env.local
//   2. Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxx (or pk_test_...)
// This value is safe to expose to the browser; it is NOT the secret key.
// ─────────────────────────────────────────────────────────────
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

type ViewState =
  | { status: "form" }
  | {
      status: "success";
      reference: string;
      amount: number;
      currency: SupportedCurrency;
      email: string;
    };

export function DonateCard() {
  const [currency, setCurrency] = useState<SupportedCurrency>("NGN");
  // No default preset — donors choose an amount themselves, nothing is pre-fixed.
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>({ status: "form" });

  const amount = customAmount ? Number(customAmount) : selectedPreset;
  const validAmount =
    typeof amount === "number" && amount > 0 && Number.isFinite(amount);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = validAmount && validEmail && !loading;

  function handleCurrencyChange(next: SupportedCurrency) {
    setCurrency(next);
    setSelectedPreset(null);
    setCustomAmount("");
    setError(null);
  }

  function handlePresetClick(value: number) {
    setSelectedPreset(value);
    setCustomAmount("");
    setError(null);
  }

  function handleCustomAmountChange(value: string) {
    setCustomAmount(value);
    setSelectedPreset(null);
  }

  async function handleDonate() {
    setError(null);

    if (!validEmail) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validAmount) {
      setError("Please enter or select a donation amount.");
      return;
    }
    if (!PAYSTACK_PUBLIC_KEY) {
      setError(
        "Payments are not configured yet. Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in your environment (see .env.example)."
      );
      return;
    }

    setLoading(true);

    try {
      await openPaystackPopup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        // Paystack expects the smallest currency unit: kobo for NGN, cents for USD.
        amount: Math.round(amount! * 100),
        currency,
        metadata: {
          full_name: fullName || undefined,
          custom_fields: [
            {
              display_name: "Full Name",
              variable_name: "full_name",
              value: fullName || "Not provided",
            },
          ],
        },
        onSuccess: (reference) => {
          void handlePaymentSuccess(reference);
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      setLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong launching the payment window. Please try again."
      );
    }
  }

  async function handlePaymentSuccess(reference: string) {
    try {
      const res = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const result = await res.json();

      if (!res.ok || !result.status) {
        setError(
          result.message ??
            `We couldn't verify your payment. Please contact support with reference: ${reference}`
        );
        return;
      }

      setView({
        status: "success",
        reference,
        amount: amount!,
        currency,
        email,
      });
    } catch {
      setError(
        `We couldn't verify your payment. Please contact support with reference: ${reference}`
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDonateAgain() {
    setView({ status: "form" });
    setCustomAmount("");
    setError(null);
  }

  if (view.status === "success") {
    return (
      <DonationSuccess
        reference={view.reference}
        amount={view.amount}
        currency={view.currency}
        email={view.email}
        onDonateAgain={handleDonateAgain}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-[#00B7C3]/15 bg-white p-8 shadow-xl shadow-[#071B2E]/10">
      {/* Header / branding */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00B7C3] to-[#2ED3C6] text-white"
        >
          <HeartHandshake className="h-5 w-5" />
        </motion.div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#00B7C3]">
            Research Atlas
          </p>
          <h1 className="text-xl font-semibold text-[#071B2E]">
            Support Research Atlas
          </h1>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[#071B2E]/70">
        Somewhere right now, someone is opening their first mission with
        nothing but curiosity and a free account. Your donation keeps it
        that way, free, for the next person too.
      </p>

      {/* Currency selector */}
      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wide text-[#071B2E]/50">
          Currency
        </p>
        <div className="mt-2 inline-flex rounded-full border border-[#00B7C3]/20 p-1">
          {(Object.keys(PRESET_AMOUNTS) as SupportedCurrency[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleCurrencyChange(c)}
              aria-pressed={currency === c}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                currency === c
                  ? "bg-[#00B7C3] text-white shadow-sm"
                  : "text-[#071B2E]/60 hover:text-[#071B2E]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Preset amounts */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS[currency].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handlePresetClick(value)}
            aria-pressed={selectedPreset === value && !customAmount}
            className={`rounded-xl border py-2.5 text-sm font-medium transition ${
              selectedPreset === value && !customAmount
                ? "border-[#00B7C3] bg-[#00B7C3]/10 text-[#00B7C3]"
                : "border-[#071B2E]/10 text-[#071B2E]/70 hover:border-[#00B7C3]/40"
            }`}
          >
            {CURRENCY_SYMBOL[currency]}
            {value.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="mt-4">
        <label
          htmlFor="donate-custom-amount"
          className="block text-xs font-medium uppercase tracking-wide text-[#071B2E]/50"
        >
          Or enter a custom amount
        </label>
        <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#071B2E]/15 px-3 py-2.5 transition focus-within:border-[#00B7C3]">
          <span className="text-[#071B2E]/50">{CURRENCY_SYMBOL[currency]}</span>
          <input
            id="donate-custom-amount"
            type="number"
            min={1}
            step="any"
            inputMode="decimal"
            value={customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            placeholder={CURRENCY_PLACEHOLDER[currency]}
            className="w-full bg-transparent text-sm text-[#071B2E] outline-none placeholder:text-[#071B2E]/30"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mt-4">
        <label
          htmlFor="donate-email"
          className="block text-xs font-medium uppercase tracking-wide text-[#071B2E]/50"
        >
          Email <span className="text-[#00B7C3]">*</span>
        </label>
        <input
          id="donate-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1.5 w-full rounded-xl border border-[#071B2E]/15 px-3 py-2.5 text-sm text-[#071B2E] outline-none transition placeholder:text-[#071B2E]/30 focus:border-[#00B7C3]"
        />
      </div>

      {/* Full name (optional) */}
      <div className="mt-4">
        <label
          htmlFor="donate-full-name"
          className="block text-xs font-medium uppercase tracking-wide text-[#071B2E]/50"
        >
          Full name <span className="text-[#071B2E]/30">(optional)</span>
        </label>
        <input
          id="donate-full-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jane Doe"
          className="mt-1.5 w-full rounded-xl border border-[#071B2E]/15 px-3 py-2.5 text-sm text-[#071B2E] outline-none transition placeholder:text-[#071B2E]/30 focus:border-[#00B7C3]"
        />
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Donate button */}
      <button
        type="button"
        onClick={handleDonate}
        disabled={!canSubmit}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00B7C3] to-[#2ED3C6] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#00B7C3]/25 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          <>
            Donate{" "}
            {validAmount
              ? `${CURRENCY_SYMBOL[currency]}${amount!.toLocaleString()}`
              : ""}
          </>
        )}
      </button>
    </div>
  );
}
