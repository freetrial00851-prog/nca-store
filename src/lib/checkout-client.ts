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

export function getDemoSuccessPath(): string {
  return "/checkout/success?demo=1";
}
