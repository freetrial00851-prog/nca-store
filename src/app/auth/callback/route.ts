import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeReturnTo } from "@/lib/auth-intent";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const returnTo = sanitizeReturnTo(searchParams.get("returnTo"));
  const action = searchParams.get("action");
  const productId = searchParams.get("productId");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const welcome = new URL("/auth/welcome", origin);
      welcome.searchParams.set("returnTo", returnTo);
      if (action) welcome.searchParams.set("action", action);
      if (productId) welcome.searchParams.set("productId", productId);
      return NextResponse.redirect(welcome);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed`);
}
