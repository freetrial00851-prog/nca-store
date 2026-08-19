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

/** Bulk read of multiple keys in one query. Missing keys are omitted from the result. */
export async function getSiteSettings(keys: string[]): Promise<Record<string, string>> {
  if (isDemoMode() || keys.length === 0) return {};

  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", keys);

  const result: Record<string, string> = {};
  for (const row of data ?? []) {
    if (row.value !== null) result[row.key] = row.value;
  }
  return result;
}
