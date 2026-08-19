"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { signupAction } from "@/app/actions/auth";
import {
  parseAuthIntentFromSearchParams,
  sanitizeReturnTo,
  saveAuthIntent,
} from "@/lib/auth-intent";
import { sanitizeAuthError } from "@/lib/auth-errors";
import { isClientDemoMode } from "@/lib/checkout-client";
import { EmailConfirmationPanel } from "@/components/auth/email-confirmation-panel";
import { toast } from "sonner";
import { Suspense } from "react";

function SignupForm() {
  const searchParams = useSearchParams();
  const intentFromUrl = parseAuthIntentFromSearchParams(searchParams);
  const returnTo = sanitizeReturnTo(searchParams.get("redirect"));
  const isDemo = isClientDemoMode();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    if (intentFromUrl) {
      saveAuthIntent({ ...intentFromUrl, returnTo });
    } else if (returnTo !== "/") {
      saveAuthIntent({ returnTo });
    }

    try {
      if (isDemo) {
        toast.success("Demo account created — welcome to NCA!");
        window.location.assign(returnTo);
        return;
      }

      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("fullName", fullName);
      formData.set("returnTo", returnTo);
      if (intentFromUrl?.action) formData.set("action", intentFromUrl.action);
      if (intentFromUrl?.productId) formData.set("productId", intentFromUrl.productId);

      const result = await signupAction(formData);

      if (result.needsConfirmation) {
        setConfirmationSent(true);
        setSentEmail(email);
        return;
      }

      window.location.assign(returnTo);
    } catch (err) {
      toast.error(sanitizeAuthError(err instanceof Error ? err.message : "Unable to create account"));
    } finally {
      setLoading(false);
    }
  }

  const loginHref = `/auth/login?redirect=${encodeURIComponent(returnTo)}${
    intentFromUrl?.action ? `&action=${intentFromUrl.action}` : ""
  }${intentFromUrl?.productId ? `&productId=${intentFromUrl.productId}` : ""}`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-nca-cream/50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
        <Link href="/" className="font-serif text-2xl font-bold text-nca-green">NCA</Link>

        {confirmationSent ? (
          <EmailConfirmationPanel
            email={sentEmail}
            returnTo={returnTo}
            onChangeEmail={() => {
              setConfirmationSent(false);
              setSentEmail("");
            }}
          />
        ) : (
          <>
            <h1 className="font-serif text-2xl font-bold mt-6 mb-1">Create Account</h1>
            <p className="text-sm text-muted-foreground mb-6">
              {intentFromUrl?.action === "favorite"
                ? "Create an account to save this pattern"
                : "Join our maker community today."}
            </p>

            {isDemo && (
              <p className="text-xs bg-nca-sage text-nca-green rounded-lg px-3 py-2 mb-4">
                Demo mode — signup skips email verification.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <PasswordInput required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Confirm Password</label>
                <PasswordInput required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-sm text-center text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href={loginHref} className="text-nca-green hover:underline font-medium">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
