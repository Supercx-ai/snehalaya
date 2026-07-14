import Link from "next/link";
import { getAccessToken } from "@/lib/session";
import { getCustomer, customerAccountConfigured } from "@/lib/customerAccount";

export default async function AccountPage() {
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
