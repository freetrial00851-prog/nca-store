export type PendingAuthAction = "favorite" | "checkout";

export interface ProductSnapshot {
  id: string;
  slug: string;
  title: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category_id: string | null;
  skill_level: string;
  is_new: boolean;
  is_active: boolean;
}

export interface AuthIntent {
  returnTo: string;
  action?: PendingAuthAction | null;
  productId?: string;
  productSnapshot?: ProductSnapshot;
  message?: string;
  createdAt: number;
}

const AUTH_INTENT_KEY = "nca-auth-intent";
const INTENT_MAX_AGE_MS = 30 * 60 * 1000;

/** Validates internal redirect paths — blocks open redirects. */
export function sanitizeReturnTo(path: string | null | undefined, fallback = "/"): string {
  if (!path || typeof path !== "string") return fallback;

  const trimmed = path.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;

  try {
    const url = new URL(trimmed, "http://localhost");
    if (url.hostname !== "localhost") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function encodeReturnTo(pathname: string, search = ""): string {
  return sanitizeReturnTo(`${pathname}${search}`);
}

export function buildAuthLoginUrl(options?: {
  returnTo?: string;
  action?: PendingAuthAction;
  productId?: string;
}): string {
  const returnTo = sanitizeReturnTo(options?.returnTo ?? "/");
  const params = new URLSearchParams({ redirect: returnTo });
  if (options?.action) params.set("action", options.action);
  if (options?.productId) params.set("productId", options.productId);
  return `/auth/login?${params.toString()}`;
}

export function resolvePostAuthDestination(
  returnTo: string,
  isAdmin: boolean
): string {
  if (isAdmin) return "/admin";
  return sanitizeReturnTo(returnTo);
}

export function saveAuthIntent(intent: Omit<AuthIntent, "createdAt">): void {
  if (typeof window === "undefined") return;
  const payload: AuthIntent = { ...intent, createdAt: Date.now() };
  sessionStorage.setItem(AUTH_INTENT_KEY, JSON.stringify(payload));
}

export function loadAuthIntent(): AuthIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(AUTH_INTENT_KEY);
    if (!raw) return null;
    const intent = JSON.parse(raw) as AuthIntent;
    if (Date.now() - intent.createdAt > INTENT_MAX_AGE_MS) {
      clearAuthIntent();
      return null;
    }
    return {
      ...intent,
      returnTo: sanitizeReturnTo(intent.returnTo),
    };
  } catch {
    return null;
  }
}

export function clearAuthIntent(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_INTENT_KEY);
}

export function parseAuthIntentFromSearchParams(
  searchParams: URLSearchParams
): Omit<AuthIntent, "createdAt"> | null {
  const redirect = searchParams.get("redirect") ?? searchParams.get("returnTo");
  if (!redirect && !searchParams.get("action")) return null;

  return {
    returnTo: sanitizeReturnTo(redirect ?? "/"),
    action: (searchParams.get("action") as PendingAuthAction) || null,
    productId: searchParams.get("productId") ?? undefined,
  };
}
