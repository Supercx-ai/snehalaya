"use server";

import { cookies } from "next/headers";
import { refreshAccessToken, type TokenResponse } from "./customerAccount";

const ACCESS = "customer_access_token";
const REFRESH = "customer_refresh_token";
const ID_TOKEN = "customer_id_token";
const secure = process.env.NODE_ENV === "production";

export async function setSession(tokens: TokenResponse) {
  const jar = await cookies();
  const opts = { httpOnly: true, sameSite: "lax" as const, path: "/", secure };
  jar.set(ACCESS, tokens.access_token, { ...opts, maxAge: tokens.expires_in });
  jar.set(REFRESH, tokens.refresh_token, { ...opts, maxAge: 60 * 60 * 24 * 30 });
  jar.set(ID_TOKEN, tokens.id_token, { ...opts, maxAge: 60 * 60 * 24 * 30 });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(ACCESS);
  jar.delete(REFRESH);
  jar.delete(ID_TOKEN);
}

export async function getIdToken() {
  return (await cookies()).get(ID_TOKEN)?.value ?? null;
}

// Returns a valid access token, transparently refreshing it if expired. Null if logged out.
// ponytail: cookie writes only work from a Route Handler/Server Action, not a plain
// Server Component render (Next.js throws) — so when this refreshes from a page like
// /account, the new token is used for that render but the write is best-effort and may
// silently no-op, meaning the next page load refreshes again instead of reusing it.
// Upgrade path: do the refresh in Middleware, which is allowed to write response cookies
// on every request, so it actually persists.
export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(ACCESS)?.value;
  if (token) return token;

  const refresh = jar.get(REFRESH)?.value;
  if (!refresh) return null;
  try {
    const tokens = await refreshAccessToken(refresh);
    try { await setSession(tokens); } catch { /* read-only render context */ }
    return tokens.access_token;
  } catch {
    try { await clearSession(); } catch { /* read-only render context */ }
    return null;
  }
}
