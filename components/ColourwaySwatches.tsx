import Image from "next/image";
import Link from "next/link";

export type Colourway = { handle: string; name: string; image: string | null };

// "Color" selector on the PDP (node 2245:865). This store publishes each colourway as
// its own product ("Mint Blue Raw Silk Saree", "Pink Raw Silk Saree", …), so the swatches
// are sibling products sharing the style phrase — clicking one navigates to that saree.
export default function ColourwaySwatches({ items, currentHandle }: { items: Colourway[]; currentHandle: string }) {
  if (items.length < 2) return null;

  return (
    <div className="mt-6">
      <div className="text-base text-ink">Color</div>
      <div className="mt-3 flex flex-wrap gap-3">
        {items.map((c) => {
          const active = c.handle === currentHandle;
          return (
            <Link key={c.handle} href={`/products/${c.handle}`} className="flex w-20 flex-col items-center gap-1.5">
              <span
                className={`relative block h-[72px] w-20 overflow-hidden rounded-lg ${
                  active ? "ring-2 ring-accent ring-offset-2" : "ring-1 ring-border"
                }`}
              >
                {c.image && <Image src={c.image} alt={c.name} fill sizes="80px" className="object-cover" />}
              </span>
              <span className={`text-center text-xs leading-tight ${active ? "font-bold text-ink" : "text-ink-subtle"}`}>
                {c.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
