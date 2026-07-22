import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/shopify";
import ProductCard from "./ProductCard";

// The upload box below routes to the already-built /image-search page (Replicate CLIP +
// Pinecone) rather than re-implementing an upload widget inline.
export default function SearchByImagePromo({ products }: { products: Product[] }) {
  return (
    <section className="max-w-[1280px] mx-auto px-9 py-8">
      <div className="relative rounded-lg overflow-hidden px-14 py-16 grid md:grid-cols-[1fr_auto] gap-10 items-center">
        <Image src="/figma/promo/card-texture.png" alt="" fill className="absolute inset-0 object-cover -z-10" />
        <div className="relative">
          <h2 className="font-display font-light text-heading-lg text-white leading-tight">Have a saree in mind?</h2>
          <p className="mt-4 max-w-[500px] text-base text-white/90 leading-relaxed">
            Upload a photo, screenshot or inspiration image and we&apos;ll find similar sarees in our catalogue — by colour, pattern, border or overall look.
          </p>

          <Link href="/image-search" className="mt-8 flex items-center gap-4 w-full max-w-[492px] rounded-lg bg-white/60 backdrop-blur px-6 py-6">
            <span className="flex items-center justify-center w-[52px] h-[52px] rounded-full bg-border-subtle shrink-0">
              <Image src="/figma/promo/upload-icon.png" alt="" width={24} height={24} />
            </span>
            <span>
              <span className="block text-lg tracking-wide2 text-primary">Search by Image</span>
              <span className="block text-xs text-ink">Drag &amp; drop or click to upload</span>
            </span>
          </Link>

          <Link href="/collections" className="mt-8 inline-flex items-center gap-2 text-2xs tracking-wide2 uppercase text-white font-semibold">
            Explore Collection
            <Image src="/figma/promo/arrow-icon.png" alt="" width={11} height={9} />
          </Link>
        </div>

        {products.length > 0 && (
          <div className="hidden md:flex gap-4">
            {products.slice(0, 2).map((p) => (
              <div key={p.id} className="bg-white rounded-lg p-3">
                <ProductCard product={p} showNewBadge />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
