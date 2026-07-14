import { NextResponse } from "next/server";
import { getIdToken, clearSession } from "@/lib/session";
import { logoutUrl } from "@/lib/customerAccount";

export async function GET(req: Request) {
  const idToken = await getIdToken();
  await clearSession();
  // Also end the Shopify-side session, not just our cookies — otherwise a re-login
  // could silently reuse an active Shopify session without re-prompting.
  return NextResponse.redirect(idToken ? logoutUrl(idToken) : new URL("/", req.url));
}
