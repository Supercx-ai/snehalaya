import Image from "next/image";
import Link from "next/link";
import { WEAVES } from "@/lib/weaves";

// Weave cards — per-card 2x exports of the tiles inside Figma node 2304:2 (gradient board
// + model cutout + white inner border baked per card; label is live text). Each card opens
// its own /weaves/[slug] listing, which reuses the exact collection PLP layout.
function WeaveCards() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-6 lg:gap-8 xl:gap-10">
      {WEAVES.map((w) => (
        <Link
          key={w.slug}
          href={`/weaves/${w.slug}`}
          className="block w-[140px] shrink-0 sm:w-auto"
        >
          <Image
            src={w.image}
            alt={w.label}
            width={w.w}
            height={w.h}
            className="w-full h-auto"
            sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 140px"
          />
          <p className="mt-2.5 text-center text-[16px] text-ink">{w.label}</p>
        </Link>
      ))}
    </div>
  );
}

export default function ShopByWeave({ bare }: { bare?: boolean }) {
  if (bare) return <WeaveCards />;

  return (
    <section className="px-4 md:px-[30px] py-12">
      <WeaveCards />
    </section>
  );
}
