import Image from "next/image";
import Link from "next/link";

// Two of five link to real collections we already have; the rest have no dedicated
// collection yet, so they fall back to free-text /search (same pattern used elsewhere).
const OCCASIONS = [
  { label: "Bridal & Muhurtham", caption: "Kanjivaram · premium silk", image: "/figma/occasions/bridal.png", href: "/collections/bridal-muhurtham", size: "large" },
  { label: "Wedding Guest", caption: "Elegant, understated", image: "/figma/occasions/wedding-guest.png", href: "/collections/wedding-guest", size: "small" },
  { label: "Festival", caption: "Pongal · Diwali · Navratri", image: "/figma/occasions/festival.png", href: "/collections/festival-occasion", size: "small" },
  { label: "Party", caption: "Contemporary drapes", image: "/figma/occasions/party.png", href: "/search?q=party", size: "small" },
  { label: "Everyday / Office", caption: "Cotton · silk-cotton", image: "/figma/occasions/everyday.png", href: "/search?q=everyday", size: "small" },
] as const;

export default function ShopByOccasion() {
  const [large, ...small] = OCCASIONS;

  return (
    <section className="max-w-[1280px] mx-auto px-8 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="font-display font-light text-8xl text-ink">Shop by Occasion</h2>
          <p className="mt-2 text-base text-ink-secondary">Every celebration has its saree. Find yours by the moment.</p>
        </div>
        <Link href="/collections" className="flex items-center justify-center h-[41px] px-8 rounded-sm bg-primary text-cream text-2xs font-semibold tracking-wide2 uppercase whitespace-nowrap">
          Explore Collection
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <OccasionCard {...large} className="md:row-span-2 aspect-[601/463] md:aspect-auto" />
        {small.map((o) => (
          <OccasionCard key={o.label} {...o} className="aspect-[293/223]" />
        ))}
      </div>
    </section>
  );
}

function OccasionCard({
  label, caption, image, href, size, className,
}: (typeof OCCASIONS)[number] & { className: string }) {
  return (
    <Link href={href} className={`relative block rounded-lg overflow-hidden ${className}`}>
      <Image src={image} alt={label} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
      <div className="absolute bottom-6 left-5 right-5">
        <p className={`font-display text-sand ${size === "large" ? "text-7xl leading-tight" : "text-3xl"}`}>{label}</p>
        <p className="mt-1 text-2xs tracking-wide2 text-sand">{caption}</p>
      </div>
    </Link>
  );
}
