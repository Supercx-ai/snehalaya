import { getAnnouncementBar } from "@/lib/shopify";

// Comp (node 2191:2): a maroon strip above the header whose messages scroll right-to-left,
// separated by a gold diamond. These three are the comp's own copy and act as the default —
// the bar used to `return null` whenever the Shopify metaobject was absent, which deleted it
// from every page. A metaobject message, when one exists, is prepended to the rotation.
const DEFAULT_MESSAGES = [
  "✨ Free Shipping Across India on Orders Above ₹5,000 ✨",
  "Welcome to Snehalayaa Silks",
  "🌏 Free International Shipping on Orders Above ₹50,000 ✨",
];

function Track({ messages, ariaHidden }: { messages: string[]; ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {messages.map((m, i) => (
        <span key={`${m}-${i}`} className="flex shrink-0 items-center whitespace-nowrap">
          <span className="px-8 text-[12px] tracking-[0.4px] text-cream">{m}</span>
          <span className="text-accent text-[9px] leading-none" aria-hidden>&#9670;</span>
        </span>
      ))}
    </div>
  );
}

export default async function AnnouncementBar() {
  const bar = await getAnnouncementBar();
  const messages = bar?.message ? [bar.message, ...DEFAULT_MESSAGES] : DEFAULT_MESSAGES;

  // Each track has to be at least as wide as the viewport, or the wrap exposes a gap: three
  // short messages measure ~1065px, which is narrower than a typical desktop. Repeating the
  // list three times per track puts one track past ~3200px, covering ultrawide screens too.
  const loop = [...messages, ...messages, ...messages];

  const marquee = (
    // Two identical tracks: the animation travels exactly -50%, so the second copy is already
    // in position when it wraps and the seam never shows.
    <div className="flex w-max animate-marquee motion-reduce:animate-none motion-reduce:justify-center">
      <Track messages={loop} />
      <Track messages={loop} ariaHidden />
    </div>
  );

  return (
    <div className="relative h-[38px] overflow-hidden bg-primary">
      {/* Pausing on hover lets people actually read a message they caught sight of. */}
      <div className="flex h-full items-center [&:hover>div]:[animation-play-state:paused]">
        {bar?.link ? (
          <a href={bar.link} className="flex h-full w-full items-center no-underline">
            {marquee}
          </a>
        ) : (
          marquee
        )}
      </div>
    </div>
  );
}
