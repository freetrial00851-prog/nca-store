"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordAction } from "@/app/actions/auth";
import { sanitizeAuthError } from "@/lib/auth-errors";
import { sanitizeReturnTo } from "@/lib/auth-intent";
import { isClientDemoMode } from "@/lib/checkout-client";
import { toast } from "sonner";
import { Suspense } from "react";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const returnTo = sanitizeReturnTo(searchParams.get("redirect"));
  const isDemo = isClientDemoMode();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isDemo) {
        setSent(true);
        return;
      }
      const formData = new FormData();
      formData.set("email", email);
      await forgotPasswordAction(formData);
      setSent(true);
    } catch (err) {
      toast.error(sanitizeAuthError(err instanceof Error ? err.message : "Unable to send reset email"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-nca-cream/50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
        <Link href="/" className="font-serif text-2xl font-bold text-nca-green">NCA</Link>

        {sent ? (
          <div className="mt-8 text-center py-4">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-nca-sage flex items-center justify-center text-nca-green text-xl font-bold">
              ✓
            </div>
            <h1 className="font-serif text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              We sent password reset instructions to your email address.
            </p>
            <Button asChild className="mt-6 w-full">
              <Link href={`/auth/login?redirect=${encodeURIComponent(returnTo)}`}>Back to Sign In</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-2xl font-bold mt-6 mb-1">Forgot Password</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your email and we&apos;ll send reset instructions.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Email"}
              </Button>
            </form>
            <p className="text-sm text-center text-muted-foreground mt-6">
              <Link href={`/auth/login?redirect=${encodeURIComponent(returnTo)}`} className="text-nca-green hover:underline font-medium">
                Back to Sign In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
