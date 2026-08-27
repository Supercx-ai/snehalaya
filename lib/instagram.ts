// Instagram reels for the homepage rail.
//
// This uses the Facebook Login for Business path (graph.facebook.com/<ig-user-id>/media)
// rather than graph.instagram.com/me/media, because the credential is a Business Manager
// *system user* token scoped to the IG Business account. That matters operationally: a
// system-user token doesn't carry the 60-day expiry a user token does, so there's no
// refresh job to run. There is no public endpoint that returns an arbitrary account's
// media — the handle alone is not enough, the token is what grants access.
const GRAPH_VERSION = "v23.0";
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;

export const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "snehalayaasilks";

export type IgMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  /** "AD" | "FEED" | "STORY" | "REELS" — the field that identifies a reel. */
  media_product_type?: string;
  media_url?: string;
  /** Only present on VIDEO media, which is what reels are. */
  thumbnail_url?: string;
  permalink: string;
  timestamp?: string;
};

const FIELDS = "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp";

/** Poster frame for a tile — for a reel the media_url is the mp4, so the thumbnail wins. */
export function posterUrl(m: IgMedia): string | undefined {
  return m.media_type === "VIDEO" ? m.thumbnail_url ?? m.media_url : m.media_url;
}

/** The mp4 for an autoplaying tile. Meta omits media_url on some reels (copyright), so
 *  this is undefined often enough that callers must handle a poster-only tile. */
export function videoUrl(m: IgMedia): string | undefined {
  return m.media_type === "VIDEO" ? m.media_url : undefined;
}

/** First line of the caption, for alt text / tooltips. Captions run long and contain tags. */
export function captionSummary(m: IgMedia, max = 90): string {
  const first = (m.caption ?? "").split("\n")[0].trim();
  return first.length > max ? `${first.slice(0, max - 1)}…` : first;
}

/**
 * Newest reels for the connected account, or null when unconfigured or the call fails, so
 * the caller can fall back instead of rendering an empty rail.
 *
 * The feed mixes reels and regular posts, so we over-fetch one page and filter. Reels are
 * media_product_type === "REELS"; older posts predate that field, hence the degrade to
 * VIDEO and then to anything with a usable poster.
 */
export async function getInstagramReels(limit = 12): Promise<IgMedia[] | null> {
  if (!TOKEN || !ACCOUNT_ID) return null;

  const url = new URL(`https://graph.facebook.com/${GRAPH_VERSION}/${ACCOUNT_ID}/media`);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("limit", "50"); // reels are a subset of the feed — over-fetch once
  url.searchParams.set("access_token", TOKEN);

  try {
    const res = await fetch(url, { next: { revalidate: 3600, tags: ["instagram"] } });
    if (!res.ok) {
      // Never log the URL or body verbatim — both can carry the access token.
      console.error(`[instagram] ${res.status} ${res.statusText} fetching media`);
      return null;
    }
    const json: { data?: IgMedia[] } = await res.json();
    const all = json.data ?? [];
    if (all.length === 0) return null;

    const reels = all.filter((m) => m.media_product_type === "REELS");
    const videos = all.filter((m) => m.media_type === "VIDEO");
    const chosen = (reels.length ? reels : videos.length ? videos : all).filter((m) => posterUrl(m));

    // The rail autoplays, so favour reels that actually ship an mp4 — roughly a third come
    // back without one. Newest-first ordering is preserved within each group; poster-only
    // reels only top up the tail if there aren't enough playable ones.
    const playable = chosen.filter((m) => videoUrl(m));
    const rest = chosen.filter((m) => !videoUrl(m));
    return [...playable, ...rest].slice(0, limit);
  } catch (err) {
    console.error("[instagram] media request failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
