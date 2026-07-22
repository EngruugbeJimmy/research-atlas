"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, CheckCircle2 } from "lucide-react";
import { PaymentButton } from "@/components/payments/payment-button";

type Currency = "USD" | "NGN";

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: "$",
  NGN: "₦",
};

const SUGGESTED_AMOUNTS: Record<Currency, number[]> = {
  USD: [5, 10, 25, 50],
  NGN: [1000, 5000, 10000, 20000],
};

export function SupportContent() {
  const [currency, setCurrency] = useState<Currency>("USD");
  // No default preset — donors choose an amount themselves, nothing is pre-fixed.
  const [selected, setSelected] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [thankYou, setThankYou] = useState<{ amount: number; currency: Currency } | null>(null);

  const amount = customAmount ? Number(customAmount) : selected;
  const validAmount = typeof amount === "number" && amount > 0 && Number.isFinite(amount);

  function handleCurrencyChange(next: Currency) {
    setCurrency(next);
    setSelected(null);
    setCustomAmount("");
  }

  function handleSelectSuggested(v: number) {
    setSelected(v);
    setCustomAmount("");
  }

  function handleSuccess() {
    if (validAmount) setThankYou({ amount: amount!, currency });
  }

  if (thankYou) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-signal-500/15 text-signal-500"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.div>
        <h1 className="mt-6 font-display text-2xl">You just kept a door open</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/65 dark:text-paper/65">
          Your {CURRENCY_SYMBOL[thankYou.currency]}
          {thankYou.amount.toLocaleString()} means someone, somewhere, gets to
          start Mission 00 without ever wondering if they can afford to keep
          going. Thank you, genuinely, for that.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-basin-500 px-6 py-2.5 text-sm font-medium text-paper hover:bg-basin-600"
        >
          Back to Research Atlas
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-signal-500/20 to-basin-500/20 text-signal-500"
        >
          <Heart className="h-7 w-7 fill-signal-500/20" />
        </motion.div>
        <p className="type-eyebrow mt-6">From one learner to another</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">
          Help someone else have this moment too
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-ink/70 dark:text-paper/70">
          Somewhere right now, someone is opening Mission 00 for the first
          time, on a cracked phone screen, between shifts, in a place where a
          paid course was never going to happen. That's who this is for.
          Whatever you can give keeps the door open for them, too.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-basin-500/15 bg-gradient-to-b from-signal-500/[0.04] to-transparent bg-paper p-6 dark:bg-ink">
        {/* Currency selector */}
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink/50 dark:text-paper/50">
          Currency
        </p>
        <div className="mt-2 inline-flex rounded-full border border-basin-500/20 p-1">
          {(Object.keys(SUGGESTED_AMOUNTS) as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCurrencyChange(c)}
              aria-pressed={currency === c}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                currency === c
                  ? "bg-basin-500 text-paper"
                  : "text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-5 font-mono text-[11px] uppercase tracking-wide text-ink/50 dark:text-paper/50">
          Choose an amount, or enter your own below
        </p>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {SUGGESTED_AMOUNTS[currency].map((v) => (
            <button
              key={v}
              onClick={() => handleSelectSuggested(v)}
              className={`rounded-xl border py-3 text-sm font-medium transition ${
                selected === v && !customAmount
                  ? "border-basin-500 bg-basin-500/10 text-basin-500"
                  : "border-basin-500/20 hover:border-basin-500/50"
              }`}
            >
              {CURRENCY_SYMBOL[currency]}
              {v.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-wide text-ink/50 dark:text-paper/50">
              Or enter a custom amount
            </span>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-ink/50 dark:text-paper/50">{CURRENCY_SYMBOL[currency]}</span>
              <input
                type="number"
                min={1}
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelected(null);
                }}
                placeholder="Any amount"
                className="w-full rounded-lg border border-basin-500/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-basin-500"
              />
            </div>
          </label>
        </div>

        <div className="mt-4">
          <label className="block">
            <span className="font-mono text-[11px] uppercase tracking-wide text-ink/50 dark:text-paper/50">
              Email (for your receipt)
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-lg border border-basin-500/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-basin-500"
            />
          </label>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={validAmount ? `${currency}-${amount}` : "invalid"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <PaymentButton
                email={email || "supporter@example.com"}
                amountInCents={validAmount ? Math.round(amount! * 100) : 0}
                currency={currency}
                label={
                  validAmount
                    ? `Donate ${CURRENCY_SYMBOL[currency]}${amount!.toLocaleString()}`
                    : "Choose an amount"
                }
                metadata={{ type: "donation" }}
                onSuccess={handleSuccess}
                disabled={!validAmount}
              />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
