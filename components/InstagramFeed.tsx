import Image from "next/image";

// Instagram Basic Display / Graph API feed — needs a long-lived access token.
// Get one via https://developers.facebook.com/docs/instagram-basic-display-api
const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "snehalayaasilks";

type InstagramPost = { id: string; media_url: string; thumbnail_url?: string; permalink: string; media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" };

export default async function InstagramFeed() {
  if (!TOKEN) return null; // ponytail: hidden until INSTAGRAM_ACCESS_TOKEN is set

  const res = await fetch(
    `https://graph.instagram.com/me/media?fields=id,media_url,thumbnail_url,permalink,media_type&access_token=${TOKEN}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  const { data: posts }: { data: InstagramPost[] } = await res.json();

  return (
    <section className="max-w-[1280px] mx-auto px-9 py-12">
      <div className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none]">
        {posts.slice(0, 6).map((p) => (
          <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer" className="relative block w-[264px] shrink-0 rounded-card overflow-hidden aspect-[264/352] bg-border-subtle">
            {/* External, unpredictable-domain images from the Instagram API — next/image needs a static remote pattern per host, plain <img> avoids that per-account config */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.media_type === "VIDEO" ? p.thumbnail_url ?? p.media_url : p.media_url} alt="" className="absolute inset-0 size-full object-cover" />
            {p.media_type === "VIDEO" && (
              <Image src="/figma/instagram/play-overlay.png" alt="" width={73} height={73} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80" />
            )}
            <Image src="/figma/instagram/badge-icon.png" alt="" width={35} height={35} className="absolute bottom-4 right-4 opacity-70" />
          </a>
        ))}
      </div>
      <a
        href={`https://instagram.com/${HANDLE}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2.5 font-display text-2xl text-ink"
      >
        <Image src="/figma/instagram/follow-icon.png" alt="" width={42} height={42} />
        Follow on Instagram <span className="text-primary">@{HANDLE}</span>
      </a>
    </section>
  );
}
