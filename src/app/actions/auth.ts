"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode, isSupabaseConfigured } from "@/lib/demo-mode";
import { buildAuthCallbackUrl, resolvePostAuthDestination, sanitizeReturnTo } from "@/lib/auth-intent";
import { sanitizeLoginError } from "@/lib/auth-errors";
import { syncGuestWishlistOnLogin } from "@/app/actions/pending-auth";

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = sanitizeReturnTo(formData.get("redirect") as string);
  const action = formData.get("action") as string | null;
  const productId = formData.get("productId") as string | null;
  const wishlistIds = formData.get("wishlistIds") as string | null;

  if (isDemoMode()) {
    redirect(redirectTo);
  }

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(sanitizeLoginError(error.message));
  }

  if (!data.session) {
    throw new Error("Unable to sign in. Please try again.");
  }

  if (wishlistIds) {
    try {
      const ids = JSON.parse(wishlistIds) as string[];
      await syncGuestWishlistOnLogin(ids);
    } catch {
      // Non-fatal
    }
  }

  let isAdmin = false;
  try {
    const { data: role } = await supabase
      .from("roles")
      .select("role")
      .eq("user_id", data.user.id)
      .maybeSingle();
    isAdmin = role?.role === "admin";
  } catch {
    // Role lookup failed
  }

  const destination = resolvePostAuthDestination(redirectTo, isAdmin);

  if (action || productId) {
    // Client-side PendingActionHandler reads sessionStorage; server can't set it.
    // Pass via query for page loads when sessionStorage wasn't set.
  }

  redirect(destination);
}

export async function signupAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string)?.trim();
  const returnTo = sanitizeReturnTo(formData.get("returnTo") as string);
  const action = formData.get("action") as string | null;
  const productId = formData.get("productId") as string | null;

  if (isDemoMode()) {
    return { needsConfirmation: false };
  }

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const supabase = await createClient();
  const emailRedirectTo = buildAuthCallbackUrl({ returnTo, action, productId });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.user && !data.session) {
    return { needsConfirmation: true, email };
  }

  return { needsConfirmation: false };
}

export async function forgotPasswordAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();

  if (isDemoMode()) {
    return { success: true };
  }

  if (!email) {
    throw new Error("Email is required");
  }

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function resendConfirmationAction(email: string, returnTo = "/") {
  if (isDemoMode()) return { success: true };

  const supabase = await createClient();
  const emailRedirectTo = buildAuthCallbackUrl({ returnTo: sanitizeReturnTo(returnTo) });

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo },
  });

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
