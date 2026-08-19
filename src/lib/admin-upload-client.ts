"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Uploads a file directly from the browser to Supabase Storage.
 * This intentionally bypasses our own server (Vercel serverless functions
 * have a hard, non-configurable 4.5MB request body limit that next.config's
 * serverActions.bodySizeLimit cannot override) — the browser talks straight
 * to Supabase, and only the resulting small URL/path gets sent to our
 * server actions afterward.
 *
 * Requires the "product-images"/"pattern-files" admin storage RLS policies
 * (admin-storage-upload-policies-migration.sql) to be applied.
 */
export async function uploadFileClient(bucket: string, path: string, file: File): Promise<string> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  if (bucket === "pattern-files") {
    // Private bucket — store the path, not a public URL.
    return path;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function slugifyClient(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
