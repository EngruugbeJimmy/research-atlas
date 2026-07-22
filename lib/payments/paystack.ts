// Paystack Inline JS integration.
//
// This is the ACTIVE payment provider for certificates and donations, per
// the product spec. It's built so that once NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
// is set in the environment, real payments start working with no code
// changes. Until then, callers should show the demo-mode UI rather than
// pretending a real charge happened — see `isPaystackConfigured()`.

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: PaystackSetupConfig) => { openIframe: () => void };
    };
  }
}

interface PaystackSetupConfig {
  key: string;
  email: string;
  amount: number; // smallest currency unit (e.g. cents / kobo)
  currency?: string;
  ref?: string;
  metadata?: Record<string, unknown>;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

const SCRIPT_URL = "https://js.paystack.co/v1/inline.js";
let scriptPromise: Promise<void> | null = null;

function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.PaystackPop) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack script"));
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
}

export interface PayParams {
  email: string;
  amountInCents: number;
  currency?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Opens the Paystack popup and resolves with the payment reference on
 * success. Throws if Paystack isn't configured — callers should check
 * isPaystackConfigured() first and offer the demo path instead.
 */
export async function payWithPaystack({
  email,
  amountInCents,
  currency = "USD",
  reference,
  metadata,
}: PayParams): Promise<{ reference: string }> {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error(
      "Paystack is not configured. Set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to accept real payments."
    );
  }

  await loadPaystackScript();

  return new Promise((resolve, reject) => {
    if (!window.PaystackPop) {
      reject(new Error("Paystack script failed to load"));
      return;
    }
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: amountInCents,
      currency,
      ref: reference ?? `atlas_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      metadata,
      callback: (response) => resolve({ reference: response.reference }),
      onClose: () => reject(new Error("Payment window closed")),
    });
    handler.openIframe();
  });
}
