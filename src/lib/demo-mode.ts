export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

/** Demo mode = no Supabase yet. Uses mock data and demo auth/checkout. */
export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}

/** Live Supabase store without payment processor — orders saved directly. */
export function isManualCheckoutMode(): boolean {
  return isSupabaseConfigured() && !isStripeConfigured();
}
