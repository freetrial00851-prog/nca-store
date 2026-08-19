"use client";

import { createClient } from "@/lib/supabase/client";
import { resolvePostAuthDestination, sanitizeReturnTo } from "@/lib/auth-intent";
import { sanitizeLoginError } from "@/lib/auth-errors";
import { syncGuestWishlistOnLogin } from "@/app/actions/pending-auth";

export async function performClientLogin(options: {
  email: string;
  password: string;
  redirectTo: string;
  wishlistIds?: string[];
}): Promise<{ ok: true; destination: string } | { ok: false; message: string }> {
  const email = options.email.trim();
  const password = options.password;
  const redirectTo = sanitizeReturnTo(options.redirectTo);

  if (!email || !password) {
    return { ok: false, message: "Email and password are required." };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: sanitizeLoginError(error.message) };
  }

  if (!data.session) {
    return { ok: false, message: "Unable to sign in. Please try again." };
  }

  // Ensure browser cookies are written before navigation
  await supabase.auth.getSession();

  let isAdmin = false;
  try {
    const { data: role } = await supabase
      .from("roles")
      .select("role")
      .eq("user_id", data.user.id)
      .maybeSingle();
    isAdmin = role?.role === "admin";
  } catch {
    // Role lookup failed — continue as regular user
  }

  if (options.wishlistIds?.length) {
    try {
      await syncGuestWishlistOnLogin(options.wishlistIds);
    } catch {
      // Non-fatal
    }
  }

  const destination = resolvePostAuthDestination(redirectTo, isAdmin);
  return { ok: true, destination };
}
