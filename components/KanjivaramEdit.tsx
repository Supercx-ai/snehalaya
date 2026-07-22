import Image from "next/image";
import Link from "next/link";

export default function KanjivaramEdit() {
  return (
    <section className="max-w-[1280px] mx-auto px-9 py-8">
      <div className="relative rounded-lg overflow-hidden h-[420px]">
        <Image src="/figma/promo/kanjivaram-edit.png" alt="The Kanjivaram Edit" fill className="object-cover" priority={false} />
        <div className="absolute inset-0 flex flex-col justify-center px-14 max-w-[600px]">
          <h2 className="font-display font-light text-heading-lg text-white leading-tight">The Kanjivaram Edit</h2>
          <p className="mt-4 text-base text-white/90 leading-relaxed">
            Woven in the finest Mulberry silk, each Kanjivaram carries the legacy of three generations of artisans — real zari, enduring weight, and colour that lasts a lifetime.
          </p>
          <Link href="/collections/kanjivaram-silk-sarees" className="mt-6 inline-flex items-center justify-center h-[43px] w-[183px] rounded-sm bg-primary text-white text-xs tracking-wide2">
            Explore Kanjivaram
          </Link>
        </div>
      </div>
    </section>
  );
}
