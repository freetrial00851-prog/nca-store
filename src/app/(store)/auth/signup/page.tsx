"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { isClientDemoMode } from "@/lib/checkout-client";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const isDemo = isClientDemoMode();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isDemo) {
        toast.success("Demo account created — welcome to NCA!");
        router.push("/account");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      toast.success("Account created! Check your email to confirm.");
      window.location.assign("/account");
      return;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-nca-cream/50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
        <Link href="/" className="font-serif text-2xl font-bold text-nca-green">NCA</Link>
        <h1 className="font-serif text-2xl font-bold mt-6 mb-1">Create Account</h1>
        <p className="text-sm text-muted-foreground mb-6">Join our maker community today.</p>

        {isDemo && (
          <p className="text-xs bg-nca-sage text-nca-green rounded-lg px-3 py-2 mb-4">
            Demo mode — signup skips email verification and goes straight to your account.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Full Name</label>
            <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-nca-green hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
