import Image from "next/image";
import Link from "next/link";

// "Everyday Elegance" has no dedicated collection yet, so it falls back to free-text
// /search — same pattern used for other unmatched Figma categories across the homepage.
const LOOKS = [
  { label: "Festive Mornings", image: "/figma/shop-look/festive-mornings.png", href: "/collections/festival-occasion" },
  { label: "The Bridal Trousseau", image: "/figma/shop-look/bridal-trousseau.png", href: "/collections/bridal-muhurtham" },
  { label: "Everyday Elegance", image: "/figma/shop-look/everyday-elegance.png", href: "/search?q=everyday" },
] as const;

export default function ShopTheLook() {
  return (
    <section className="max-w-[1280px] mx-auto px-9 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-display font-light text-heading-xl text-ink">Shop the Look</h2>
          <p className="mt-1 text-base text-ink-subtle">Inspired by Snehalayaa moments.</p>
        </div>
        <Link href="/collections" className="flex items-center justify-center h-[41px] px-8 rounded-sm bg-primary text-cream text-2xs font-semibold tracking-wide2 uppercase whitespace-nowrap">
          Explore Collection
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LOOKS.map((l) => (
          <Link key={l.label} href={l.href} className="relative block rounded-lg overflow-hidden aspect-[387/516]">
            <Image src={l.image} alt={l.label} fill className="object-cover" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-3">
              <span className="font-display text-3xl text-cream">{l.label}</span>
              <span className="flex items-center justify-center h-[31px] px-4 rounded-sm bg-cream text-primary text-xs tracking-wide2 whitespace-nowrap shrink-0">
                Shop Look →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
