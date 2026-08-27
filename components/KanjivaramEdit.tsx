import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify";

// Comp: node 2191:586. Full-bleed — the comp's background runs edge to edge with square
// corners, so this section deliberately skips the px-4/md:px-[30px] gutters and the
// rounded-lg every other section uses.
//
// The background is node 2191:588 (the photo + its left-hand gradient scrim). The previous
// asset baked the four product tiles into the image, which meant they could never be real
// products; this one is the clean plate and the tiles are rendered from live data on top.
export default function KanjivaramEdit({ products = [] }: { products?: Product[] }) {
  return (
    <section className="relative w-full h-[560px] md:h-[653px] overflow-hidden">
      <Image
        src="/figma/promo/kanjivaram-bg.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-right md:object-[100%_18%]"
        priority={false}
      />

      {/* Comp puts a dark smoke gradient down the left on mobile so the headline and button
          hold up against the photograph; desktop doesn't need it. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent md:hidden" />

      <div className="relative h-full flex flex-col justify-center md:justify-start md:pt-[85px] px-6 md:px-[60px]">
        <h2 className="font-display font-light text-heading-sm md:text-heading-lg text-white leading-tight">The Kanjivaram Edit</h2>
        <p className="mt-4 max-w-[520px] text-base text-white/90 leading-relaxed">
          Woven in the finest Mulberry silk, each Kanjivaram carries the legacy of three generations of artisans — real zari, enduring weight, and colour that lasts a lifetime.
        </p>
        <Link
          href="/collections/kanjivaram-silk"
          className="mt-6 inline-flex items-center justify-center h-[43px] w-[183px] rounded-sm bg-primary text-white text-xs tracking-wide2"
        >
          Explore Kanjivaram
        </Link>

        {products.length > 0 && (
          <div className="mt-12 flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] md:mt-8">
            {products.slice(0, 4).map((p) => {
              // Comp badges two of the four; only flag what the catalogue actually marks new
              // rather than inventing it per-position.
              const isNew = (p.tags ?? []).some((t) => t.toLowerCase() === "new");
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.handle}`}
                  className="relative block w-[130px] md:w-[168px] aspect-[168/222] shrink-0 rounded-[8px] overflow-hidden border border-white/70 bg-black/10"
                >
                  {p.featuredImage && (
                    <Image src={p.featuredImage.url} alt={p.title} fill sizes="168px" className="object-cover" />
                  )}
                  {isNew && (
                    <span className="absolute bottom-2 left-2 rounded-[3px] bg-primary px-2 py-0.5 text-[10px] tracking-wide2 text-cream">
                      New
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
