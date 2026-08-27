import Image from "next/image";
import Link from "next/link";

// "Everyday Elegance" has no dedicated collection yet, so it falls back to free-text
// /search — same pattern used for other unmatched Figma categories across the homepage.
const LOOKS = [
  { label: "Festive Mornings", image: "/figma/shop-look/festive-mornings.png", href: "/collections/festive-kanjivarams" },
  { label: "The Bridal Trousseau", image: "/figma/shop-look/bridal-trousseau.png", href: "/collections/maharani-bridal-collection" },
  { label: "Everyday Elegance", image: "/figma/shop-look/everyday-elegance.png", href: "/search?q=everyday" },
] as const;

export default function ShopTheLook() {
  return (
    <section className="pl-4 md:px-[30px] py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-left pr-4 md:pr-0">
        <div>
          <h2 className="font-display font-light text-heading-sm md:text-heading-xl text-ink">Shop the Look</h2>
          <p className="mt-1 text-base text-ink-subtle">Inspired by Snehalayaa moments.</p>
        </div>
        <Link href="/collections" className="hidden md:flex items-center justify-center h-[41px] px-8 rounded-sm bg-primary text-cream text-2xs font-semibold tracking-wide2 uppercase whitespace-nowrap">
          Explore Collection
        </Link>
      </div>

      {/* Mobile Figma keeps these as a horizontal-scroll strip, matching the other
          look/weave carousels — only becomes a stacked grid from md: up. */}
      <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible pb-2 pr-4 md:pr-0">
        {LOOKS.map((l) => (
          <Link key={l.label} href={l.href} className="relative block rounded-lg overflow-hidden aspect-[278/370] md:aspect-[387/516] w-[278px] md:w-auto shrink-0">
            <Image src={l.image} alt={l.label} fill className="object-cover" />
            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 flex items-center justify-between gap-3">
              <span className="font-display text-xl md:text-3xl text-cream">{l.label}</span>
              <span className="flex items-center justify-center h-[26px] md:h-[31px] px-3 md:px-4 rounded-sm bg-cream text-primary text-2xs md:text-xs tracking-wide2 whitespace-nowrap shrink-0">
                Shop Look →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center md:hidden mt-6 pr-4">
        <Link href="/collections" className="inline-flex items-center justify-center h-[41px] px-8 rounded-sm bg-primary text-cream text-2xs font-semibold tracking-wide2 uppercase">
          Explore Collection
        </Link>
      </div>
    </section>
  );
}
