"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";

export function FloatingSupportButton() {
  const pathname = usePathname();
  // Don't show it on the support page itself, or stacked on top of the
  // certificate/checkout flow where a second payment CTA would be noisy.
  const hideOn = ["/support", "/certification/checkout"];
  if (hideOn.includes(pathname)) return null;

  return (
    <Link
      href="/support"
      className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full border border-basin-500/20 bg-paper/95 px-4 py-2.5 text-sm font-medium text-ink shadow-lg backdrop-blur transition hover:border-signal-500/40 hover:text-signal-500 dark:bg-ink/95 dark:text-paper"
      aria-label="Support Research Atlas"
    >
      <Heart className="h-4 w-4 text-signal-500" />
      <span className="hidden sm:inline">Support Research Atlas</span>
    </Link>
  );
}
