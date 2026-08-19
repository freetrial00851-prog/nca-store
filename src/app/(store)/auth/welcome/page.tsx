"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { parseWelcomeParams, saveAuthIntent, sanitizeReturnTo } from "@/lib/auth-intent";
import { Suspense } from "react";

function WelcomeRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const intent = parseWelcomeParams(params);
    const returnTo = sanitizeReturnTo(params.get("returnTo"));

    if (intent) {
      saveAuthIntent(intent);
    }

    window.location.replace(returnTo);
  }, []);

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-muted-foreground">Signing you in...</p>
        <Link href="/" className="text-sm text-nca-green hover:underline mt-4 inline-block">
          Continue to homepage
        </Link>
      </div>
    </div>
  );
}

export default function AuthWelcomePage() {
  return (
    <Suspense>
      <WelcomeRedirect />
    </Suspense>
  );
}
