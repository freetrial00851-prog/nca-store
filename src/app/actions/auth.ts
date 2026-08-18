"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode, isSupabaseConfigured } from "@/lib/demo-mode";

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/";

  if (isDemoMode()) {
    redirect(redirectTo === "/account" ? "/" : redirectTo);
  }

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  let destination = redirectTo === "/account" ? "/" : redirectTo;

  try {
    const { data: role } = await supabase
      .from("roles")
      .select("role")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (role?.role === "admin") {
      destination = "/admin";
    }
  } catch {
    // Role lookup failed — still redirect to homepage
  }

  redirect(destination);
}

export async function logout() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
