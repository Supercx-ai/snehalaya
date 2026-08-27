import Image from "next/image";
import { getInstagramReels, posterUrl, videoUrl, captionSummary, INSTAGRAM_HANDLE } from "@/lib/instagram";
import ReelTile from "./ReelTile";

// Reel stills lifted from the comp's own scroller (node 2191:770, layer "sneha-scroll").
// They already carry the play ring and the Instagram badge, so they render flat — no
// overlay treatment on top. Only used when the API is unconfigured or unreachable.
const FALLBACK_REELS = [
  "/figma/instagram/reel-1.png",
  "/figma/instagram/reel-2.png",
  "/figma/instagram/reel-3.png",
];

const TILE = "relative block w-[264px] shrink-0 rounded-card overflow-hidden aspect-[264/352] bg-border-subtle";

// The section used to `return null` whenever the token was missing, which removed it from
// the page entirely. It always renders now: live reels when the integration is configured,
// the comp's stills otherwise.
export default async function InstagramFeed() {
  const reels = await getInstagramReels(12);
  const profileUrl = `https://instagram.com/${INSTAGRAM_HANDLE}`;

  return (
    <section className="px-4 md:px-[30px] py-12">
      <div className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none]">
        {reels
          ? reels.map((m) => {
              const caption = captionSummary(m);
              return (
                // Instagram CDN URLs are signed and short-lived and sit on rotating
                // fbcdn hosts, so these bypass next/image entirely.
                <ReelTile
                  key={m.id}
                  src={videoUrl(m)}
                  poster={posterUrl(m)}
                  href={m.permalink}
                  label={caption ? `Instagram reel: ${caption}` : `Reel from @${INSTAGRAM_HANDLE}`}
                  className={TILE}
                />
              );
            })
          : FALLBACK_REELS.map((src, i) => (
              <a key={src} href={profileUrl} target="_blank" rel="noopener noreferrer" className={TILE}>
                <Image src={src} alt={`Snehalayaa Silks reel ${i + 1} on Instagram`} fill sizes="264px" className="object-cover" />
              </a>
            ))}
      </div>

      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2.5 font-display text-2xl text-ink"
      >
        <Image src="/figma/instagram/follow-icon.png" alt="" width={42} height={42} />
        Follow on Instagram <span className="text-primary">@{INSTAGRAM_HANDLE}</span>
      </a>
    </section>
  );
}
