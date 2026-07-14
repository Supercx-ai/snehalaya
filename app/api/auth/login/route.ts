import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildAuthorizeUrl, generatePkce, customerAccountConfigured } from "@/lib/customerAccount";

export async function GET() {
  if (!customerAccountConfigured) {
    return new Response(
      "Login isn't configured yet — set SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID and SHOPIFY_SHOP_ID.",
      { status: 501 }
    );
  }

  const { verifier, challenge } = generatePkce();
  const state = crypto.randomBytes(16).toString("hex");

  const jar = await cookies();
  const opts = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 600 };
  jar.set("oauth_verifier", verifier, opts);
  jar.set("oauth_state", state, opts);

  return NextResponse.redirect(buildAuthorizeUrl(state, challenge));
}
