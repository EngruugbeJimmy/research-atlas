import { NextRequest, NextResponse } from "next/server";

// Verifies a Paystack transaction reference server-side, using the secret
// key. This is intentionally separate from the client-side "success"
// callback in lib/payments/paystack.ts: a client callback alone can be
// spoofed by anyone with devtools open, so nothing should be unlocked
// (like a certificate) purely because the browser said the payment worked.
//
// Requires PAYSTACK_SECRET_KEY (server-only, never NEXT_PUBLIC_*) to be set.
// Until it is, this route reports itself as unconfigured rather than
// pretending to verify anything.

export async function POST(req: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      {
        verified: false,
        configured: false,
        message:
          "Paystack secret key is not configured on the server. Add PAYSTACK_SECRET_KEY to enable real payment verification.",
      },
      { status: 501 }
    );
  }

  const body = await req.json().catch(() => null);
  const reference = body?.reference;
  if (!reference || typeof reference !== "string") {
    return NextResponse.json({ verified: false, message: "Missing reference" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
      cache: "no-store",
    });
    const data = await res.json();

    const verified = data?.status === true && data?.data?.status === "success";
    return NextResponse.json({
      verified,
      configured: true,
      amount: data?.data?.amount ?? null,
      currency: data?.data?.currency ?? null,
    });
  } catch {
    return NextResponse.json(
      { verified: false, configured: true, message: "Could not reach Paystack" },
      { status: 502 }
    );
  }
}
