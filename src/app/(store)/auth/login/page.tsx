"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { isClientDemoMode } from "@/lib/checkout-client";
import { toast } from "sonner";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/account";
  const isDemo = isClientDemoMode();
  const [email, setEmail] = useState(isDemo ? "sarah@example.com" : "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isDemo) {
        toast.success("Demo sign-in — welcome, Sarah!");
        router.push(redirect);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!");
      // Full navigation so auth cookies reach middleware before /account loads
      window.location.assign(redirect);
      return;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-nca-cream/50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
        <Link href="/" className="font-serif text-2xl font-bold text-nca-green">NCA</Link>
        <h1 className="font-serif text-2xl font-bold mt-6 mb-1">Sign In</h1>
        <p className="text-sm text-muted-foreground mb-6">Access your orders, downloads, and wishlist.</p>

        {isDemo && (
          <p className="text-xs bg-nca-sage text-nca-green rounded-lg px-3 py-2 mb-4">
            Demo mode — click Sign In with any password to access the account portal.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isDemo ? "any password" : ""} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-nca-green hover:underline font-medium">Create one</Link>
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
