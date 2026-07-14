import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens } from "@/lib/customerAccount";
import { setSession } from "@/lib/session";

function fail(req: Request, reason: string) {
  return NextResponse.redirect(new URL(`/account?error=${reason}`, req.url));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const jar = await cookies();
  const expectedState = jar.get("oauth_state")?.value;
  const verifier = jar.get("oauth_verifier")?.value;
  jar.delete("oauth_state");
  jar.delete("oauth_verifier");

  if (!code) return fail(req, "missing_code");
  // Most common local-dev cause: oauth_state/oauth_verifier cookies never arrived —
  // e.g. login started on a different host than the callback landed on.
  if (!expectedState || !verifier) return fail(req, "missing_cookies");
  if (state !== expectedState) return fail(req, "state_mismatch");

  try {
    const tokens = await exchangeCodeForTokens(code, verifier);
    await setSession(tokens);
  } catch (e) {
    console.error("Customer Account token exchange failed:", e);
    return fail(req, "token_exchange_failed");
  }

  return NextResponse.redirect(new URL("/account", req.url));
}
