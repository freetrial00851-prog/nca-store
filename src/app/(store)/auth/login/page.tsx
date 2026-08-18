"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/app/actions/auth";
import { isClientDemoMode, isNextRedirectError } from "@/lib/checkout-client";
import { toast } from "sonner";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirect = redirectParam && redirectParam !== "/account" ? redirectParam : "/";
  const isDemo = isClientDemoMode();
  const [email, setEmail] = useState(isDemo ? "sarah@example.com" : "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("redirect", redirect);

    try {
      await loginAction(formData);
    } catch (err) {
      if (isNextRedirectError(err)) throw err;
      toast.error(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-nca-cream/50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
        <Link href="/" className="font-serif text-2xl font-bold text-nca-green">
          NCA
        </Link>
        <h1 className="font-serif text-2xl font-bold mt-6 mb-1">Sign In</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Sign in to shop, checkout, and access your patterns.
        </p>

        {isDemo && (
          <p className="text-xs bg-nca-sage text-nca-green rounded-lg px-3 py-2 mb-4">
            Demo mode — click Sign In with any password.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="redirect" value={redirect} />
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <Input
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isDemo ? "any password" : ""}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-nca-green hover:underline font-medium">
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
