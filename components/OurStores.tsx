import Image from "next/image";
import Link from "next/link";
import { STORES } from "@/lib/stores";

export default function OurStores() {
  return (
    <section className="px-4 md:px-[30px] py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STORES.map((s) => (
          <div key={s.city} className="rounded-lg overflow-hidden border border-border-strong bg-white">
            <div className="relative aspect-[560/379] m-2.5 rounded-md overflow-hidden">
              <Image src={s.image} alt={s.label} fill className="object-cover" />
            </div>
            <div className="px-5 md:px-9 py-6">
              <h3 className="font-display font-light text-3xl md:text-4xl text-ink mb-1">{s.label}</h3>
              <p className="text-sm text-ink-subtle mb-4">{s.address}</p>
              <Link href={`/store-locator`} className="text-lg text-primary tracking-wide2">
                Get Direction
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
