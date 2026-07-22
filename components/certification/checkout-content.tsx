"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { EXAM_PASS_PERCENT } from "@/lib/exam";
import { PaymentButton } from "@/components/payments/payment-button";

const CERTIFICATE_PRICE_CENTS = 500; // $5.00

export function CheckoutContent() {
  const router = useRouter();
  const { hydrated, progress, saveCertificate } = useProgress();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [institution, setInstitution] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    setName(progress.learnerProfile.name);
    setEmail(progress.learnerProfile.email);
    setCountry(progress.learnerProfile.country);
    setInstitution(progress.learnerProfile.institution);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 md:px-8">
        <div className="h-40 animate-pulse rounded-2xl bg-basin-500/5" />
      </div>
    );
  }

  const eligible = (progress.examBestScorePercent ?? 0) >= EXAM_PASS_PERCENT;
  const canPay = eligible && name.trim().length > 0 && email.trim().length > 3;

  if (!eligible) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center md:px-8">
        <p className="text-sm text-ink/65 dark:text-paper/65">
          You need to pass the final exam before you can order a certificate.
        </p>
        <Link href="/certification" className="mt-4 inline-block text-basin-500 hover:underline">
          Back to certification
        </Link>
      </div>
    );
  }

  function handleSuccess() {
    saveCertificate({ learnerName: name, email, country, institution });
    router.push("/certification/certificate");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:px-8">
      <p className="type-eyebrow">One-time fee</p>
      <h1 className="mt-2 text-3xl font-medium">Get your certificate</h1>
      <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">
        $5 covers hosting and verification for your Research Atlas Certificate of Achievement.
      </p>

      <div className="mt-8 space-y-4 rounded-2xl border border-basin-500/15 bg-paper p-6 dark:bg-ink">
        <Field label="Full name (as it should appear on the certificate)" value={name} onChange={setName} placeholder="Ada Lovelace" required />
        <Field label="Email" value={email} onChange={setEmail} placeholder="ada@example.com" type="email" required />
        <Field label="Country" value={country} onChange={setCountry} placeholder="Nigeria" />
        <Field label="Institution or organization (optional)" value={institution} onChange={setInstitution} placeholder="University of Lagos" />
      </div>

      <div className="mt-6">
        <PaymentButton
          email={email || "learner@example.com"}
          amountInCents={CERTIFICATE_PRICE_CENTS}
          label="Pay $5 and issue my certificate"
          metadata={{ type: "certificate", name, country, institution }}
          onSuccess={handleSuccess}
          disabled={!canPay}
        />
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-ink/45 dark:text-paper/45">
        <ShieldCheck className="h-3.5 w-3.5" /> Payments are processed securely by Paystack. Research Atlas never stores your card details.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wide text-ink/50 dark:text-paper/50">
        {label} {required && <span className="text-basin-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full rounded-lg border border-basin-500/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-basin-500"
      />
    </label>
  );
}
