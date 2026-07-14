import Link from "next/link";
import { getAccessToken } from "@/lib/session";
import { getCustomer, customerAccountConfigured } from "@/lib/customerAccount";

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "Shopify didn't send back an authorization code.",
  missing_cookies: "The login session cookies were missing when you got back — often means you started login on a different host/URL than the one Shopify redirected back to, or waited too long (cookies expire after 10 min).",
  state_mismatch: "The security state didn't match — try logging in again.",
  token_exchange_failed: "Shopify rejected the token exchange — check the server logs for details.",
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  if (!customerAccountConfigured) {
    return (
      <main>
        <h1>Account</h1>
        <p style={{ color: "#666" }}>
          Login isn't set up yet — needs Shopify's Customer Account API (Admin → Settings →
          Customer accounts → New customer accounts, then register a client). See{" "}
          <code>.env.example</code> for the two variables it needs.
        </p>
      </main>
    );
  }

  const token = await getAccessToken();
  if (!token) {
    return (
      <main>
        <h1>Account</h1>
        {error && (
          <p style={{ color: "#c00", padding: "0.75rem", background: "#fee", borderRadius: 8, marginBottom: "1rem" }}>
            {ERROR_MESSAGES[error] ?? `Login failed (${error}).`}
          </p>
        )}
        <a href="/api/auth/login" style={{ display: "inline-block", padding: "0.75rem 1.5rem", background: "#111", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
          Log in
        </a>
      </main>
    );
  }

  const customer = await getCustomer(token);

  return (
    <main>
      <h1>Hi, {customer.firstName ?? "there"}</h1>
      {customer.emailAddress && <p style={{ color: "#666" }}>{customer.emailAddress.emailAddress}</p>}
      <nav style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
        <Link href="/account/orders">Order history</Link>
        <a href="/api/auth/logout">Log out</a>
      </nav>
    </main>
  );
}
