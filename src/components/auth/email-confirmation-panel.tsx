"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { resendConfirmationAction } from "@/app/actions/auth";
import { sanitizeAuthError } from "@/lib/auth-errors";
import { isClientDemoMode } from "@/lib/checkout-client";
import { toast } from "sonner";

const COOLDOWN_SECONDS = 60;

interface EmailConfirmationPanelProps {
  email: string;
  returnTo?: string;
  onChangeEmail?: () => void;
}

export function EmailConfirmationPanel({
  email,
  returnTo = "/",
  onChangeEmail,
}: EmailConfirmationPanelProps) {
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const isDemo = isClientDemoMode();

  async function handleResend() {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      if (isDemo) {
        toast.success("Confirmation email sent (demo mode)");
      } else {
        await resendConfirmationAction(email, returnTo);
        toast.success("Confirmation email sent");
      }
      setCooldown(COOLDOWN_SECONDS);
      const interval = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(sanitizeAuthError(err instanceof Error ? err.message : "Unable to resend email"));
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="mt-8 text-center py-4">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-nca-sage flex items-center justify-center text-nca-green text-xl font-bold">
        ✓
      </div>
      <h2 className="font-serif text-xl font-bold mb-2">Confirm your email</h2>
      <p className="text-sm text-muted-foreground mb-2">We sent a confirmation link to:</p>
      <p className="text-sm font-medium mb-4">{email}</p>
      <p className="text-sm text-muted-foreground mb-6">
        Please check your inbox and click the confirmation link to activate your account.
      </p>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
        >
          {resending
            ? "Sending..."
            : cooldown > 0
              ? `Resend email (${cooldown}s)`
              : "Resend email"}
        </Button>
        {onChangeEmail && (
          <Button variant="ghost" className="w-full text-sm" onClick={onChangeEmail}>
            Change email
          </Button>
        )}
      </div>
    </div>
  );
}
