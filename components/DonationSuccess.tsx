"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Copy, Check, Heart, RotateCcw } from "lucide-react";
import { formatDonationAmount, type SupportedCurrency } from "@/lib/paystack";

interface DonationSuccessProps {
  reference: string;
  amount: number;
  currency: SupportedCurrency;
  email: string;
  onDonateAgain: () => void;
}

export function DonationSuccess({
  reference,
  amount,
  currency,
  email,
  onDonateAgain,
}: DonationSuccessProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Best-effort celebratory confetti burst. If canvas-confetti isn't
    // available for any reason, the success screen still works fine
    // without it — this is purely decorative.
    let cancelled = false;
    import("canvas-confetti")
      .then(({ default: confetti }) => {
        if (cancelled) return;
        confetti({
          particleCount: 90,
          spread: 100,
          origin: { y: 0.6 },
          colors: ["#00B7C3", "#2ED3C6", "#071B2E"],
        });
      })
      .catch(() => {
        // Confetti is decorative only — safe to ignore failures.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, unsupported browser) —
      // not critical, the reference is still visible on screen.
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-[#00B7C3]/15 bg-white p-8 text-center shadow-xl shadow-[#071B2E]/10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#00B7C3] to-[#2ED3C6] text-white shadow-lg shadow-[#00B7C3]/30">
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <h2 className="mt-6 text-2xl font-semibold text-[#071B2E]">
        Thank you for supporting Research Atlas 🎉
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#071B2E]/70">
        Your donation of{" "}
        <span className="font-semibold text-[#071B2E]">
          {formatDonationAmount(amount, currency)}
        </span>{" "}
        was received. A receipt has been sent to{" "}
        <span className="font-medium text-[#071B2E]">{email}</span>.
      </p>

      <div className="mt-6 rounded-xl bg-[#F7FBFC] p-4 text-left">
        <p className="text-xs font-medium uppercase tracking-wide text-[#071B2E]/50">
          Transaction Reference
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <code className="truncate text-sm text-[#071B2E]">{reference}</code>
          <button
            type="button"
            onClick={copyReference}
            aria-label="Copy transaction reference"
            className="shrink-0 rounded-lg p-1.5 text-[#00B7C3] transition hover:bg-[#00B7C3]/10"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onDonateAgain}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#00B7C3]/30 px-5 py-2.5 text-sm font-medium text-[#00B7C3] transition hover:bg-[#00B7C3]/10"
        >
          <RotateCcw className="h-4 w-4" /> Donate again
        </button>
        <a
          href="/"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00B7C3] to-[#2ED3C6] px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-[#00B7C3]/25 transition hover:brightness-105"
        >
          <Heart className="h-4 w-4" /> Back to Research Atlas
        </a>
      </div>
    </div>
  );
}
