import { createClient, createAdminClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";

export async function requireUser() {
  if (isDemoMode()) {
    return { id: "demo-user", email: "demo@example.com" };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Not authenticated");
  }

  return user;
}

export async function requireAdmin() {
  if (isDemoMode()) {
    return { id: "demo-admin", email: "admin@example.com" };
  }

  const user = await requireUser();
  const supabase = await createClient();
  const { data: role } = await supabase
    .from("roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (role?.role !== "admin") {
    throw new Error("Admin access required");
  }

  return user;
}

export async function getAdminDb() {
  await requireAdmin();
  return createAdminClient();
}
