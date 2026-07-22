import { NextRequest, NextResponse } from "next/server";
import type { PaystackVerifyResponse } from "@/lib/paystack";

/**
 * app/api/paystack/verify/route.ts
 *
 * Verifies a Paystack transaction reference server-side using
 * PAYSTACK_SECRET_KEY. This key must NEVER be exposed to the client —
 * that's the whole reason this route exists instead of trusting the
 * client's "success" callback directly.
 *
 * Replace the placeholder value of PAYSTACK_SECRET_KEY in your
 * environment (.env.local for local dev, your hosting provider's
 * environment variable settings for production). See .env.example.
 */
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY.startsWith("sk_xxxx")) {
      return NextResponse.json(
        {
          status: false,
          message:
            "Payments are not configured on this server yet. Set PAYSTACK_SECRET_KEY in your environment.",
        },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => null);
    const reference = body?.reference;

    if (!reference || typeof reference !== "string") {
      return NextResponse.json(
        { status: false, message: "Missing or invalid transaction reference." },
        { status: 400 }
      );
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
        cache: "no-store",
      }
    );

    const data: PaystackVerifyResponse = await verifyRes.json();

    if (!verifyRes.ok || !data.status) {
      return NextResponse.json(
        {
          status: false,
          message: data.message ?? "Paystack could not verify this transaction.",
        },
        { status: 502 }
      );
    }

    if (data.data?.status !== "success") {
      return NextResponse.json(
        {
          status: false,
          message: "This transaction was not successful.",
          data: data.data,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: true,
      message: "Transaction verified successfully.",
      data: data.data,
    });
  } catch (error) {
    console.error("Paystack verification error:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Something went wrong while verifying your payment. Please try again.",
      },
      { status: 500 }
    );
  }
}
