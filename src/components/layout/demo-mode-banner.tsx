"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { isClientDemoMode, isClientStripeConfigured } from "@/lib/checkout-client";

export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false);
  const isDemo = isClientDemoMode();
  const hasStripe = isClientStripeConfigured();

  if (dismissed) return null;

  if (isDemo) {
    return (
      <div className="bg-nca-green text-white text-sm py-2 px-4">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <p>
            <strong>Demo mode</strong> — browsing with sample data.{" "}
            <Link href="/contact" className="underline underline-offset-2 hover:text-nca-sage">
              Connect Supabase
            </Link>{" "}
            for live auth, orders, and downloads.
          </p>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1 hover:bg-white/10 rounded"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!hasStripe) {
    return (
      <div className="bg-amber-700 text-white text-sm py-2 px-4">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <p>
            <strong>Live mode</strong> — Supabase connected. Orders save to your account without card payments.
            Add Stripe env vars when you&apos;re ready to charge customers.
          </p>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1 hover:bg-white/10 rounded"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}
