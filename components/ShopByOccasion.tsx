import Image from "next/image";
import Link from "next/link";

// Two of five link to real collections we already have; the rest have no dedicated
// collection yet, so they fall back to free-text /search (same pattern used elsewhere).
const OCCASIONS = [
  { label: "Bridal & Muhurtham", caption: "Kanjivaram · premium silk", image: "/figma/occasions/bridal.png", href: "/collections/maharani-bridal-collection", size: "large" },
  { label: "Wedding Guest", caption: "Elegant, understated", image: "/figma/occasions/wedding-guest.png", href: "/collections/designer", size: "small" },
  { label: "Festival", caption: "Pongal · Diwali · Navratri", image: "/figma/occasions/festival.png", href: "/collections/festive-kanjivarams", size: "small" },
  { label: "Party", caption: "Contemporary drapes", image: "/figma/occasions/party.png", href: "/search?q=party", size: "small" },
  { label: "Everyday / Office", caption: "Cotton · silk-cotton", image: "/figma/occasions/everyday.png", href: "/search?q=everyday", size: "small" },
] as const;

export default function ShopByOccasion() {
  const [large, ...small] = OCCASIONS;

  return (
    <section className="px-4 md:px-[30px] py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-light text-heading-sm md:text-8xl text-ink">Shop by Occasion</h2>
          <p className="mt-2 text-base text-ink-secondary">Every celebration has its saree. Find yours by the moment.</p>
        </div>
        <Link href="/collections" className="hidden md:flex items-center justify-center h-[41px] px-8 rounded-sm bg-primary text-cream text-2xs font-semibold tracking-wide2 uppercase whitespace-nowrap">
          Explore Collection
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <OccasionCard {...large} className="col-span-2 md:row-span-2 aspect-[3/2] md:aspect-auto" />
        {small.map((o) => (
          <OccasionCard key={o.label} {...o} className="aspect-[293/223]" />
        ))}
      </div>

      <div className="md:hidden text-center mt-8">
        <Link href="/collections" className="inline-flex items-center justify-center h-[41px] px-8 rounded-sm bg-primary text-cream text-2xs font-semibold tracking-wide2 uppercase">
          Explore Collection
        </Link>
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
        <p className={`font-display text-sand ${size === "large" ? "text-4xl md:text-7xl leading-tight" : "text-xl md:text-3xl"}`}>{label}</p>
        <p className="mt-1 text-2xs tracking-wide2 text-sand">{caption}</p>
      </div>
    </Link>
  );
}
