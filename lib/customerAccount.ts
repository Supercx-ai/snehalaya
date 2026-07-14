// Shopify Customer Account API — OAuth 2.0 Authorization Code + PKCE (public client, no secret).
// Separate system from the Storefront API: this is real user login, not a public token.
// Setup: Admin → Settings → Customer accounts → switch to "New customer accounts", then
// register a Customer Account API client (redirect URI: <site>/api/auth/callback) to get
// SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID + SHOPIFY_SHOP_ID (the numeric shop id, not the domain).
// Field names in getCustomer/getOrders are written from Shopify's documented schema but
// UNVERIFIED live (no client ID to test against yet) — confirm once configured.
import crypto from "node:crypto";

const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;
const SHOP_ID = process.env.SHOPIFY_SHOP_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const API_VERSION = "2025-04"; // ponytail: bump alongside the Storefront API version

export const customerAccountConfigured = Boolean(CLIENT_ID && SHOP_ID);

const AUTH_BASE = `https://shopify.com/authentication/${SHOP_ID}`;
const GRAPHQL_URL = `https://shopify.com/${SHOP_ID}/account/customer/api/${API_VERSION}/graphql`;
export const REDIRECT_URI = `${SITE_URL}/api/auth/callback`;
const SCOPES = "openid email customer-account-api:full";

function base64url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generatePkce() {
  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

export function buildAuthorizeUrl(state: string, codeChallenge: string) {
  const url = new URL(`${AUTH_BASE}/oauth/authorize`);
  url.searchParams.set("client_id", CLIENT_ID!);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

export type TokenResponse = { access_token: string; expires_in: number; refresh_token: string; id_token: string };

async function tokenRequest(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(`${AUTH_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });
  if (!res.ok) throw new Error(`Customer Account token request failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export function exchangeCodeForTokens(code: string, verifier: string) {
  return tokenRequest({
    grant_type: "authorization_code",
    client_id: CLIENT_ID!,
    redirect_uri: REDIRECT_URI,
    code,
    code_verifier: verifier,
  });
}

export function refreshAccessToken(refreshToken: string) {
  return tokenRequest({ grant_type: "refresh_token", client_id: CLIENT_ID!, refresh_token: refreshToken });
}

export function logoutUrl(idToken: string) {
  return `${AUTH_BASE}/logout?id_token_hint=${encodeURIComponent(idToken)}`;
}

// --- Customer Account GraphQL ---
type CAResponse<T> = { data?: T; errors?: { message: string }[] };

async function customerAccountFetch<T>(accessToken: string, query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: accessToken },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Customer Account API ${res.status}: ${await res.text()}`);
  const json: CAResponse<T> = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data!;
}

export type Customer = { firstName: string | null; lastName: string | null; emailAddress: { emailAddress: string } | null };

export function getCustomer(accessToken: string) {
  return customerAccountFetch<{ customer: Customer }>(
    accessToken,
    `{ customer { firstName lastName emailAddress { emailAddress } } }`
  ).then((d) => d.customer);
}

export type Order = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: { amount: string; currencyCode: string };
};

export function getOrders(accessToken: string, first = 20) {
  return customerAccountFetch<{ customer: { orders: { nodes: Order[] } } }>(
    accessToken,
    `query Orders($first: Int!) { customer { orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
      nodes { id name processedAt financialStatus fulfillmentStatus totalPrice { amount currencyCode } }
    } } }`,
    { first }
  ).then((d) => d.customer.orders.nodes);
}
