import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForTokens } from "@/lib/customerAccount";
import { setSession } from "@/lib/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const jar = await cookies();
  const expectedState = jar.get("oauth_state")?.value;
  const verifier = jar.get("oauth_verifier")?.value;
  jar.delete("oauth_state");
  jar.delete("oauth_verifier");

  if (!code || !state || !verifier || state !== expectedState) {
    return NextResponse.redirect(new URL("/account?error=auth_failed", req.url));
  }

  const tokens = await exchangeCodeForTokens(code, verifier);
  await setSession(tokens);
  return NextResponse.redirect(new URL("/account", req.url));
}
