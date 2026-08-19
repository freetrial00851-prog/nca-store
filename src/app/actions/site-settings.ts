import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo-mode";

/** Public read — safe to call from any server component. Returns null if unset or unconfigured. */
export async function getSiteSetting(key: string): Promise<string | null> {
  if (isDemoMode()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  return data?.value ?? null;
}
