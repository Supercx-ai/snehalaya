import Image from "next/image";
import Link from "next/link";

// Figma node 2191:606. The comp's photo mosaic is four columns of saree portraits flanking
// a maroon silk centre, and each column scrolls — outer pair one way, inner pair the other.
//
// Assets: silk-bg is the section's Background image layer. The four column frames export
// clipped to the section height (the Mask group clips them), so only one whole portrait
// survives per column — photo-1/2/3 are those, re-cut to a single 186x213 cell. The comp's
// fourth column frame sits at 20% opacity, so its portrait exports washed out and is left
// out rather than mixed in with the clean three; column depth is done in CSS instead.
const PHOTOS = [
  { src: "/figma/maharani/photo-1.png", alt: "Model in a violet zari Kanjivaram saree" },
  { src: "/figma/maharani/photo-2.png", alt: "Model with a veena in a red and green silk saree" },
  { src: "/figma/maharani/photo-3.png", alt: "Model in a yellow silk saree with a maroon border" },
];

// Each column starts the rotation at a different photo so the four don't read as clones.
// All four run at full opacity — the comp fades its outer frame to 20%, but that reads as
// blur on screen, so depth is left to the centre scrim instead.
const COLUMNS = [
  { offset: 0, dir: "up", duration: "44s", opacity: "opacity-100" },
  { offset: 1, dir: "down", duration: "36s", opacity: "opacity-100" },
  { offset: 2, dir: "down", duration: "38s", opacity: "opacity-100" },
  { offset: 0, dir: "up", duration: "46s", opacity: "opacity-100" },
] as const;

function Column({ offset, dir, duration, opacity }: (typeof COLUMNS)[number]) {
  // Rotated set rendered twice — the animation travels exactly one set, so the second copy
  // is already in place when it wraps.
  const ordered = [...PHOTOS.slice(offset), ...PHOTOS.slice(0, offset)];
  const cells = [...ordered, ...ordered];

  return (
    <div className={`relative h-full w-[186px] shrink-0 overflow-hidden ${opacity}`}>
      <div
        className={`flex flex-col gap-[15px] ${dir === "up" ? "animate-column-up" : "animate-column-down"} motion-reduce:animate-none`}
        style={{ animationDuration: duration }}
      >
        {cells.map((p, i) => (
          <div key={i} className="relative h-[213px] w-[186px] shrink-0 overflow-hidden rounded-[4px]">
            <Image src={p.src} alt={i < ordered.length ? p.alt : ""} fill sizes="186px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MaharaniPromo() {
  return (
    // bg-primary is the comp's own #67111a fill, kept as the paint underneath so the white
    // headline stays legible before the silk image decodes.
    <section className="relative h-[420px] sm:h-[500px] md:h-[598px] overflow-hidden bg-primary">
      <Image src="/figma/maharani/silk-bg.png" alt="" fill priority={false} className="object-cover" />

      {/* Columns hug the two edges rather than sitting at fixed percentages — the section is
          full-bleed now, so anchoring keeps the mosaic framing the headline at any width. */}
      <div className="absolute inset-y-0 left-4 md:left-10 hidden sm:flex gap-[15px]" aria-hidden>
        {COLUMNS.slice(0, 2).map((c, i) => <Column key={i} {...c} />)}
      </div>
      <div className="absolute inset-y-0 right-4 md:right-10 hidden sm:flex gap-[15px]" aria-hidden>
        {COLUMNS.slice(2).map((c, i) => <Column key={i} {...c} />)}
      </div>

      {/* Darkens only the middle so the headline stays readable. A full-width scrim washed
          the portraits out — this one is fully transparent by the time it reaches them. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 46% 80% at 50% 50%, rgba(103,17,26,0.94) 0%, rgba(103,17,26,0.82) 45%, rgba(103,17,26,0) 78%)" }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-display font-light text-heading-sm md:text-heading-lg text-white">MAHARANI</h2>
        <div className="mt-4 w-[220px] sm:w-[301px] border-t border-accent" />
        <p className="mt-4 font-display font-semibold text-2xl text-[#f3e7dc]">Limited pieces. Exceptional craftsmanship.</p>
        <Link href="/collections/maharani-bridal-collection" className="mt-8 flex items-center justify-center h-[43px] w-[183px] rounded-sm bg-white text-primary text-xs tracking-wide2">
          Discover Maharani
        </Link>
      </div>
    </section>
  );
}
