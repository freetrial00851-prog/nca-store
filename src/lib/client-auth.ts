"use client";

import { resolvePostAuthDestination, sanitizeReturnTo } from "@/lib/auth-intent";
import { sanitizeLoginError } from "@/lib/auth-errors";

export async function performClientLogin(options: {
  email: string;
  password: string;
  redirectTo: string;
}): Promise<{ ok: true; destination: string } | { ok: false; message: string }> {
  const email = options.email.trim();
  const password = options.password;
  const redirectTo = sanitizeReturnTo(options.redirectTo);

  if (!email || !password) {
    return { ok: false, message: "Email and password are required." };
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, redirectTo }),
      credentials: "same-origin",
    });

    const data = (await res.json()) as {
      ok: boolean;
      destination?: string;
      message?: string;
    };

    console.log("[client-auth] /api/auth/login response status:", res.status);
    console.log("[client-auth] /api/auth/login response body:", data);

    if (!res.ok || !data.ok) {
      return {
        ok: false,
        message: data.message ?? "Unable to sign in. Please check your email and password.",
      };
    }

    return {
      ok: true,
      destination: data.destination ?? resolvePostAuthDestination(redirectTo, false),
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong. Please check your connection and try again.",
    };
  }
}
