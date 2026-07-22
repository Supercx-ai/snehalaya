"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { instantSearch } from "@/lib/search";
import type { Product } from "@/lib/shopify";

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounce: wait 250ms after typing stops before hitting the API.
  useEffect(() => {
    if (q.trim().length < 2) { setResults([]); return; }
    const id = setTimeout(() => instantSearch(q).then((r) => { setResults(r); setOpen(true); }), 250);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (!boxRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={boxRef} className="relative flex-1 min-w-0 max-w-[496px]">
      <form
        onSubmit={(e) => { e.preventDefault(); setOpen(false); router.push(`/search?q=${encodeURIComponent(q)}`); }}
        className="flex items-center h-[48px] bg-white border border-border-strong rounded-md pl-4 pr-1"
      >
        <Image src="/figma/icon-search.svg" alt="" width={18} height={18} className="shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search for sarees, collections and more"
          className="flex-1 min-w-0 border-0 outline-none px-3 text-md text-ink placeholder:text-ink-faint bg-transparent"
        />
        <Link
          href="/image-search"
          className="flex items-center gap-1.5 shrink-0 border-l border-border pl-3 pr-2 py-3 text-base text-ink-muted whitespace-nowrap"
        >
          <Image src="/figma/icon-image-search.svg" alt="" width={16} height={16} />
          Image Search
        </Link>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-[110%] left-0 right-0 bg-white border border-border rounded-md shadow-lg z-50">
          {results.map((p) => (
            <Link key={p.id} href={`/products/${p.handle}`} onClick={() => setOpen(false)} className="flex gap-2 p-2 text-ink">
              {p.featuredImage && <Image src={p.featuredImage.url} alt="" width={40} height={40} className="rounded object-cover" />}
              <div>
                <div className="text-md">{p.title}</div>
                <div className="text-sm text-ink-secondary">{p.priceRange.minVariantPrice.amount} {p.priceRange.minVariantPrice.currencyCode}</div>
              </div>
            </Link>
          ))}
          <Link href={`/search?q=${encodeURIComponent(q)}`} onClick={() => setOpen(false)} className="block p-2 text-center text-sm border-t border-border text-ink">
            See all results for "{q}"
          </Link>
        </div>
      )}
    </div>
  );
}
