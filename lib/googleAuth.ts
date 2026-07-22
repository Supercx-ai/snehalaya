// Shared service-account credentials for the Vision REST API + @google-cloud/storage.
// Paste the downloaded service-account JSON key, base64-encoded, into
// GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 — avoids multi-line private_key quoting issues
// that plain .env files (and Vercel's env UI) are finicky about.
import { GoogleAuth } from "google-auth-library";

const KEY_B64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;

export const visionSearchConfigured = Boolean(
  KEY_B64 && process.env.GOOGLE_CLOUD_PROJECT_ID && process.env.GOOGLE_CLOUD_LOCATION && process.env.GOOGLE_CLOUD_STORAGE_BUCKET
);

export function getGoogleCredentials() {
  if (!KEY_B64) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 is not set");
  return JSON.parse(Buffer.from(KEY_B64, "base64").toString("utf8"));
}

export const GOOGLE_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID ?? "";
export const GOOGLE_LOCATION = process.env.GOOGLE_CLOUD_LOCATION ?? "asia-east1";
export const GOOGLE_BUCKET = process.env.GOOGLE_CLOUD_STORAGE_BUCKET ?? "";

let auth: GoogleAuth | null = null;

// Bearer token for raw REST calls to the Vision API — reused across calls,
// google-auth-library caches and refreshes it internally.
export async function getGoogleAccessToken(): Promise<string> {
  auth ??= new GoogleAuth({ credentials: getGoogleCredentials(), scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  if (!token) throw new Error("Failed to obtain Google access token");
  return token;
}
