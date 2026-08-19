export function isClientDemoMode(): boolean {
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isClientStripeConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: string }).digest === "string" &&
    (error as { digest: string }).digest.includes("NEXT_REDIRECT")
  );
}

/** Force a full page load for Next.js server-action redirects (avoids stale router cache). */
export function redirectHard(error: unknown): boolean {
  if (
    typeof error !== "object" ||
    error === null ||
    !("digest" in error) ||
    typeof (error as { digest: string }).digest !== "string"
  ) {
    return false;
  }

  const digest = (error as { digest: string }).digest;
  if (!digest.startsWith("NEXT_REDIRECT")) return false;

  const parts = digest.split(";");
  const url = parts.slice(2, -2).join(";") || parts[2];
  if (!url || typeof window === "undefined") return false;

  window.location.assign(url);
  return true;
}

export function getDemoSuccessPath(): string {
  return "/checkout/success?demo=1";
}
