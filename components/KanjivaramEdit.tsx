import Image from "next/image";
import Link from "next/link";

export default function KanjivaramEdit() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-9 py-8">
      {/* aspect-[1280/737] (the asset's real pixel size) from md: up shows the baked-in
          thumbnail strip near the bottom uncropped, with text top-aligned above it. Below
          md: the image is too narrow for that ratio to leave room for the text, so it keeps
          a fixed crop height instead — the thumbnail strip is cropped off on small screens. */}
      <div className="relative w-full rounded-lg overflow-hidden h-[480px] md:h-auto md:aspect-[1280/737]">
        <Image src="/figma/promo/kanjivaram-edit.png" alt="The Kanjivaram Edit" fill className="object-cover" priority={false} />
        <div className="absolute inset-0 flex flex-col justify-start pt-6 sm:pt-10 md:pt-14 px-6 md:px-14 max-w-full md:max-w-[600px]">
          <h2 className="font-display font-light text-heading-sm md:text-heading-lg text-white leading-tight">The Kanjivaram Edit</h2>
          <p className="mt-4 text-base text-white/90 leading-relaxed">
            Woven in the finest Mulberry silk, each Kanjivaram carries the legacy of three generations of artisans — real zari, enduring weight, and colour that lasts a lifetime.
          </p>
          <Link href="/collections/kanjivaram-silk" className="mt-6 inline-flex items-center justify-center h-[43px] w-[183px] rounded-sm bg-primary text-white text-xs tracking-wide2">
            Explore Kanjivaram
          </Link>
        </div>
      </div>
    </section>
  );
}
