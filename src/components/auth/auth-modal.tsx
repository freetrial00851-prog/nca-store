"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuthUiStore } from "@/lib/store/auth-ui-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { createClient } from "@/lib/supabase/client";
import { signupAction } from "@/app/actions/auth";
import { completePendingAuthAction } from "@/app/actions/pending-auth";
import {
  saveAuthIntent,
  sanitizeReturnTo,
} from "@/lib/auth-intent";
import { sanitizeAuthError, sanitizeLoginError } from "@/lib/auth-errors";
import { isClientDemoMode, isNextRedirectError } from "@/lib/checkout-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AuthModal() {
  const router = useRouter();
  const {
    modalOpen,
    modalView,
    modalMessage,
    pendingIntent,
    closeAuthModal,
    setModalView,
  } = useAuthUiStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSent, setSignupSent] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const isDemo = isClientDemoMode();

  useEffect(() => {
    if (!modalOpen) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setLoading(false);
      setSignupSent(false);
      setSignupEmail("");
    }
  }, [modalOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && modalOpen) closeAuthModal();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, closeAuthModal]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const returnTo = sanitizeReturnTo(
      pendingIntent?.returnTo ?? (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/")
    );

    if (pendingIntent) {
      saveAuthIntent({ ...pendingIntent, returnTo });
    }

    try {
      if (isDemo) {
        closeAuthModal();
        toast.success("Signed in (demo mode)");
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(sanitizeLoginError(error.message));
        setLoading(false);
        return;
      }

      if (data.user && !data.user.email_confirmed_at) {
        toast.error("Your email is not confirmed yet. Please check your inbox.");
        setLoading(false);
        return;
      }

      await completePendingAuthAction(pendingIntent ?? { returnTo });

      if (pendingIntent?.action === "favorite" && pendingIntent.productSnapshot) {
        useWishlistStore.getState().addItem(pendingIntent.productSnapshot as import("@/types/database").Product);
        toast.success("Saved to your favorites");
      } else {
        toast.success("Signed in successfully");
      }

      closeAuthModal();
      router.refresh();
    } catch (err) {
      if (isNextRedirectError(err)) throw err;
      toast.error(sanitizeLoginError(err instanceof Error ? err.message : "Unable to sign in"));
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const returnTo = sanitizeReturnTo(
      pendingIntent?.returnTo ?? (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/")
    );

    if (pendingIntent) {
      saveAuthIntent({ ...pendingIntent, returnTo });
    }

    try {
      if (isDemo) {
        closeAuthModal();
        toast.success("Account created (demo mode)");
        return;
      }

      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("fullName", fullName);
      formData.set("returnTo", returnTo);
      if (pendingIntent?.action) formData.set("action", pendingIntent.action);
      if (pendingIntent?.productId) formData.set("productId", pendingIntent.productId);

      const result = await signupAction(formData);

      if (result.needsConfirmation) {
        setSignupSent(true);
        setSignupEmail(email);
        setLoading(false);
        return;
      }

      await completePendingAuthAction(pendingIntent ?? { returnTo });
      closeAuthModal();
      router.refresh();
      toast.success("Welcome to NCA!");
    } catch (err) {
      toast.error(sanitizeAuthError(err instanceof Error ? err.message : "Unable to create account"));
      setLoading(false);
    }
  }

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeAuthModal}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <Link href="/" className="font-serif text-2xl font-bold text-nca-green">
          NCA
        </Link>

        {signupSent ? (
          <div className="mt-8 text-center py-4">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-nca-sage flex items-center justify-center text-nca-green text-xl font-bold">
              ✓
            </div>
            <h2 id="auth-modal-title" className="font-serif text-xl font-bold mb-2">
              Confirm your email
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              We sent a confirmation link to:
            </p>
            <p className="text-sm font-medium mb-4">{signupEmail}</p>
            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the confirmation link to activate your account.
            </p>
            <Button variant="outline" className="mt-6 w-full" onClick={closeAuthModal}>
              Close
            </Button>
          </div>
        ) : modalView === "signin" ? (
          <>
            <h2 id="auth-modal-title" className="font-serif text-2xl font-bold mt-6 mb-1">
              Sign In
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {modalMessage ?? "Sign in to continue."}
            </p>

            {isDemo && (
              <p className="text-xs bg-nca-sage text-nca-green rounded-lg px-3 py-2 mb-4">
                Demo mode — use any password.
              </p>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
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
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-sm text-center mt-4">
              <Link
                href={`/auth/forgot-password${pendingIntent?.returnTo ? `?redirect=${encodeURIComponent(pendingIntent.returnTo)}` : ""}`}
                className="text-nca-green hover:underline"
                onClick={closeAuthModal}
              >
                Forgot password?
              </Link>
            </p>

            <p className="text-sm text-center text-muted-foreground mt-4">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-nca-green hover:underline font-medium"
                onClick={() => setModalView("signup")}
              >
                Create one
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 id="auth-modal-title" className="font-serif text-2xl font-bold mt-6 mb-1">
              Create Account
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {modalMessage ?? "Join our maker community."}
            </p>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <Input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                />
              </div>
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Confirm Password</label>
                <PasswordInput
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-sm text-center text-muted-foreground mt-6">
              Already have an account?{" "}
              <button
                type="button"
                className="text-nca-green hover:underline font-medium"
                onClick={() => setModalView("signin")}
              >
                Sign in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
