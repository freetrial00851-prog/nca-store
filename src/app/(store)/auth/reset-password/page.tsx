"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPasswordAction } from "@/app/actions/auth";
import { sanitizeAuthError } from "@/lib/auth-errors";
import { isClientDemoMode } from "@/lib/checkout-client";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const isDemo = isClientDemoMode();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isDemo) {
        setSuccess(true);
        return;
      }
      const formData = new FormData();
      formData.set("password", password);
      formData.set("confirmPassword", confirmPassword);
      await resetPasswordAction(formData);
      setSuccess(true);
    } catch (err) {
      toast.error(sanitizeAuthError(err instanceof Error ? err.message : "Unable to reset password"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-nca-cream/50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
        <Link href="/" className="font-serif text-2xl font-bold text-nca-green">NCA</Link>

        {success ? (
          <div className="mt-8 text-center py-4">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-nca-sage flex items-center justify-center text-nca-green text-xl font-bold">
              ✓
            </div>
            <h1 className="font-serif text-2xl font-bold mb-2">Password updated</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Your password has been changed successfully.
            </p>
            <Button className="w-full" onClick={() => router.push("/auth/login")}>
              Sign In
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-2xl font-bold mt-6 mb-1">Reset Password</h1>
            <p className="text-sm text-muted-foreground mb-6">Enter your new password below.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">New Password</label>
                <PasswordInput
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Confirm Password</label>
                <PasswordInput
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
