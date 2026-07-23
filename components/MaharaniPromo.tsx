import Image from "next/image";
import Link from "next/link";

export default function MaharaniPromo() {
  return (
    <section className="relative h-[420px] sm:h-[500px] md:h-[598px] overflow-hidden">
      <Image src="/figma/maharani/silk-bg.png" alt="" fill className="object-cover" />
      <Image src="/figma/maharani/photo-mosaic.png" alt="" fill className="object-contain opacity-60 md:opacity-100" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-display font-light text-heading-sm md:text-heading-lg text-white">MAHARANI</h2>
        <div className="mt-4 w-[220px] sm:w-[301px] border-t border-accent" />
        <p className="mt-4 font-display font-semibold text-2xl text-[#f3e7dc]">Limited pieces. Exceptional craftsmanship.</p>
        <Link href="/collections/maharani-exclusive" className="mt-8 flex items-center justify-center h-[43px] w-[183px] rounded-sm bg-white text-primary text-xs tracking-wide2">
          Discover Maharani
        </Link>
      </div>
    </section>
  );
}
