import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { resolvePostAuthDestination, sanitizeReturnTo } from "@/lib/auth-intent";
import { sanitizeLoginError } from "@/lib/auth-errors";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string; redirectTo?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 }
    );
  }

  const email = body.email?.trim();
  const password = body.password;
  const redirectTo = sanitizeReturnTo(body.redirectTo);

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, message: "Email and password are required." },
      { status: 400 }
    );
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.json(
      { ok: false, message: "Authentication is not configured." },
      { status: 503 }
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("[api/auth/login] signInWithPassword error:", error ?? null);
  console.log("[api/auth/login] data.session present:", Boolean(data.session));

  if (error) {
    return NextResponse.json(
      { ok: false, message: sanitizeLoginError(error.message) },
      { status: 401 }
    );
  }

  if (!data.session) {
    return NextResponse.json(
      { ok: false, message: "Unable to sign in. Please try again." },
      { status: 401 }
    );
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
    // Non-fatal
  }

  const destination = resolvePostAuthDestination(redirectTo, isAdmin);
  return NextResponse.json({ ok: true, destination });
}
