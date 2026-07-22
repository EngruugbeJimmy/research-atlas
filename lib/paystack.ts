/**
 * lib/paystack.ts
 *
 * Client-side helpers for the Paystack Inline Popup (NOT Paystack Payment
 * Pages). This file never touches PAYSTACK_SECRET_KEY — the secret key
 * stays server-only, inside app/api/paystack/verify/route.ts.
 */

export type SupportedCurrency = "NGN" | "USD";

export interface PaystackCustomField {
  display_name: string;
  variable_name: string;
  value: string;
}

export interface PaystackInlineConfig {
  /** Your Paystack public key. Comes from NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY. */
  key: string;
  email: string;
  /** Amount in the currency's smallest unit (kobo for NGN, cents for USD). */
  amount: number;
  currency: SupportedCurrency;
  /** Optional — auto-generated if omitted. */
  ref?: string;
  metadata?: {
    full_name?: string;
    custom_fields?: PaystackCustomField[];
    [key: string]: unknown;
  };
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: "success" | "failed" | "abandoned" | string;
    reference: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    customer: {
      email: string;
    };
  };
}

interface PaystackHandler {
  openIframe: () => void;
}

interface PaystackPopSetupOptions {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata?: Record<string, unknown>;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

interface PaystackPopGlobal {
  setup: (options: PaystackPopSetupOptions) => PaystackHandler;
}

/**
 * NOTE: window.PaystackPop is also declared as a global in
 * lib/payments/paystack.ts (the platform's existing donation flow).
 * Rather than re-declaring the same global with a conflicting shape
 * (which TypeScript rejects), this file reads it via a local cast.
 */
function getPaystackPop(): PaystackPopGlobal | undefined {
  return (window as unknown as { PaystackPop?: PaystackPopGlobal }).PaystackPop;
}

const PAYSTACK_SCRIPT_SRC = "https://js.paystack.co/v1/inline.js";

let scriptLoadingPromise: Promise<void> | null = null;

/**
 * Loads the Paystack Inline script exactly once, no matter how many times
 * it's called (subsequent calls reuse the same in-flight/resolved promise).
 */
export function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Paystack Inline can only be loaded in the browser.")
    );
  }

  if (getPaystackPop()) {
    return Promise.resolve();
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PAYSTACK_SCRIPT_SRC}"]`
    );

    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load the Paystack script."))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = PAYSTACK_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load the Paystack script."));
    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
}

/** Generates a reasonably unique client-side transaction reference. */
export function generatePaystackReference(prefix = "ra"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Opens the Paystack Inline popup. Resolves once the popup has launched —
 * the actual payment outcome arrives later via onSuccess/onCancel.
 */
export async function openPaystackPopup(
  config: PaystackInlineConfig
): Promise<void> {
  if (!config.key) {
    throw new Error(
      "Missing Paystack public key. Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in your environment."
    );
  }

  await loadPaystackScript();

  const paystackPop = getPaystackPop();
  if (!paystackPop) {
    throw new Error("Paystack failed to initialize. Please try again.");
  }

  const reference = config.ref ?? generatePaystackReference();

  const handler = paystackPop.setup({
    key: config.key,
    email: config.email,
    amount: config.amount,
    currency: config.currency,
    ref: reference,
    metadata: config.metadata,
    callback: (response) => {
      config.onSuccess(response.reference);
    },
    onClose: () => {
      config.onCancel();
    },
  });

  handler.openIframe();
}

/** Formats a major-unit amount (e.g. 10 for $10, 5000 for ₦5000) for display. */
export function formatDonationAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  const symbol = currency === "NGN" ? "₦" : "$";
  return `${symbol}${amount.toLocaleString()}`;
}
