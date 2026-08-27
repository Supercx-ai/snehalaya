import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify";
import ProductCard from "./ProductCard";

// The upload box below routes to the already-built /image-search page (Replicate CLIP +
// Pinecone) rather than re-implementing an upload widget inline.
export default function SearchByImagePromo({ products }: { products: Product[] }) {
  return (
    <section className="px-4 md:px-[30px] py-8">
      {/* Comp (node 2191:403): the card is solid #67111a with the paisley image at just 15%
          over it — the old texture asset was the pre-rebrand purple at full strength, which
          is what made the whole section read purple. Radius is 33.78 in the comp. */}
      <div className="relative rounded-[34px] overflow-hidden bg-primary px-6 py-10 md:px-14 md:py-16 grid md:grid-cols-[1fr_auto] gap-10 items-center">
        {/* No -z-10 here: that stacks the texture *behind* the parent, so the bg-primary
            fill would paint straight over the mandala. bg-primary is only the base coat for
            the moment before this decodes; the positioned children below still sit on top. */}
        <Image src="/figma/promo/card-texture.png" alt="" fill priority={false} sizes="100vw" className="absolute inset-0 object-cover" />
        <div className="relative">
          <h2 className="font-display font-light text-heading-sm md:text-heading-lg text-white leading-tight">Have a saree in mind?</h2>
          <p className="mt-4 max-w-[500px] text-base text-white/90 leading-relaxed">
            Upload a photo, screenshot or inspiration image and we&apos;ll find similar sarees in our catalogue — by colour, pattern, border or overall look.
          </p>

          <Link href="/image-search" className="mt-8 flex items-center gap-4 w-full max-w-[492px] rounded-2xl bg-white/85 px-6 py-6">
            <span className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-border-subtle shrink-0">
              <Image src="/figma/promo/upload-icon.png" alt="" width={24} height={24} />
            </span>
            <span>
              <span className="block text-lg tracking-wide2 text-primary">Search by Image</span>
              <span className="block text-xs text-ink">Drag &amp; drop or click to upload</span>
            </span>
          </Link>

        </div>

        {products.length > 0 && (
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 md:flex md:gap-4">
              {products.slice(0, 2).map((p) => (
                <div key={p.id} className="bg-white rounded-lg p-2 md:p-3">
                  <ProductCard product={p} showNewBadge fluid />
                </div>
              ))}
            </div>
            <Link
              href="/collections"
              className="mt-6 flex items-center justify-center gap-1.5 text-2xs tracking-wide2 uppercase text-white font-semibold"
            >
              Explore Collection
              <span aria-hidden>&#8599;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
