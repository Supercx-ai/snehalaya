import Image from "next/image";
import { STORES } from "@/lib/stores";

// Map embeds use Google's key-free "output=embed" iframe (no Maps API key needed).
// Upgrade to the official Embed API (needs NEXT_PUBLIC_GOOGLE_MAPS_KEY) only if you need custom markers/styling.
export default function StoreLocator() {
  return (
    <main className="max-w-[1280px] mx-auto px-9 py-12">
      <h1 className="font-display font-light text-heading-lg text-ink mb-8">Visit our showrooms</h1>
      <div className="grid gap-8 md:grid-cols-2">
        {STORES.map((s) => (
          <div key={s.city} className="rounded-lg border border-border-strong overflow-hidden bg-white">
            <div className="relative aspect-[560/379]">
              <Image src={s.image} alt={s.label} fill className="object-cover" />
            </div>
            <div className="p-6">
              <h2 className="font-display font-light text-4xl text-ink mb-1">{s.label}</h2>
              <p className="text-ink-subtle mb-1">{s.address}</p>
              <p className="text-ink-subtle mb-1">{s.hours}</p>
              <p className="text-ink-subtle mb-3">{s.phone}</p>
              <a href={`https://maps.google.com/maps?q=${encodeURIComponent(s.address)}`} target="_blank" rel="noopener noreferrer" className="text-primary tracking-wide2">
                Get Direction
              </a>
              <iframe
                title={`${s.city} store map`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`}
                className="w-full h-[250px] border-0 rounded-lg mt-4"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
