import { Storage } from "@google-cloud/storage";
import { getGoogleCredentials, GOOGLE_BUCKET } from "./googleAuth";

let storage: Storage | null = null;
function client() {
  storage ??= new Storage({ credentials: getGoogleCredentials() });
  return storage;
}

// Product Search reference images must be a gs:// URI — Shopify's CDN URL doesn't
// qualify, so we mirror each product image into our own bucket once.
export async function mirrorImageToGCS(sourceUrl: string, objectPath: string): Promise<string> {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`Failed to fetch source image ${sourceUrl}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  const bucket = client().bucket(GOOGLE_BUCKET);
  const file = bucket.file(objectPath);
  await file.save(buffer, { contentType: res.headers.get("content-type") ?? "image/jpeg" });

  return `gs://${GOOGLE_BUCKET}/${objectPath}`;
}

export async function deleteFromGCS(objectPath: string) {
  await client().bucket(GOOGLE_BUCKET).file(objectPath).delete({ ignoreNotFound: true });
}
