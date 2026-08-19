"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  parseAuthIntentFromSearchParams,
  sanitizeReturnTo,
  saveAuthIntent,
} from "@/lib/auth-intent";
import { performClientLogin } from "@/lib/client-auth";
import { isClientDemoMode } from "@/lib/checkout-client";
import { toast } from "sonner";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const intentFromUrl = parseAuthIntentFromSearchParams(searchParams);
  const redirect = sanitizeReturnTo(
    searchParams.get("redirect") ?? searchParams.get("returnTo")
  );
  const isDemo = isClientDemoMode();
  const [email, setEmail] = useState(isDemo ? "sarah@example.com" : "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "confirmation_failed") {
      toast.error("This confirmation link has expired or is invalid. Please sign in or request a new link.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (intentFromUrl) {
      saveAuthIntent(intentFromUrl);
    } else if (redirect !== "/") {
      saveAuthIntent({ returnTo: redirect });
    }

    if (isDemo) {
      window.location.assign(redirect);
      return;
    }

    const result = await performClientLogin({
      email,
      password,
      redirectTo: redirect,
    });

    if (!result.ok) {
      toast.error(result.message);
      setLoading(false);
      return;
    }

    toast.success("Signed in successfully");
    window.location.assign(result.destination);
  }

  const signupHref = `/auth/signup?redirect=${encodeURIComponent(redirect)}${
    intentFromUrl?.action ? `&action=${intentFromUrl.action}` : ""
  }${intentFromUrl?.productId ? `&productId=${intentFromUrl.productId}` : ""}`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-nca-cream/50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
        <Link href="/" className="font-serif text-2xl font-bold text-nca-green">
          NCA
        </Link>
        <h1 className="font-serif text-2xl font-bold mt-6 mb-1">Sign In</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {intentFromUrl?.action === "favorite"
            ? "Sign in to save this pattern"
            : "Sign in to shop, checkout, and access your patterns."}
        </p>

        {isDemo && (
          <p className="text-xs bg-nca-sage text-nca-green rounded-lg px-3 py-2 mb-4">
            Demo mode — click Sign In with any password.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <PasswordInput
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isDemo ? "any password" : ""}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          <Link
            href={`/auth/forgot-password?redirect=${encodeURIComponent(redirect)}`}
            className="text-nca-green hover:underline"
          >
            Forgot password?
          </Link>
        </p>

        <p className="text-sm text-center text-muted-foreground mt-4">
          Don&apos;t have an account?{" "}
          <Link href={signupHref} className="text-nca-green hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
