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
    <div ref={boxRef} style={{ position: "relative", flex: 1, maxWidth: 320 }}>
      <form
        onSubmit={(e) => { e.preventDefault(); setOpen(false); router.push(`/search?q=${encodeURIComponent(q)}`); }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search sarees…"
          style={{ width: "100%", padding: "0.5rem 0.75rem", border: "1px solid #ccc", borderRadius: 8 }}
        />
      </form>

      {open && results.length > 0 && (
        <div style={{ position: "absolute", top: "110%", left: 0, right: 0, background: "#fff", border: "1px solid #eee", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,.1)", zIndex: 50 }}>
          {results.map((p) => (
            <Link key={p.id} href={`/products/${p.handle}`} onClick={() => setOpen(false)} style={{ display: "flex", gap: "0.5rem", padding: "0.5rem", textDecoration: "none", color: "inherit" }}>
              {p.featuredImage && <Image src={p.featuredImage.url} alt="" width={40} height={40} style={{ borderRadius: 4, objectFit: "cover" }} />}
              <div>
                <div style={{ fontSize: "0.9rem" }}>{p.title}</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>{p.priceRange.minVariantPrice.amount} {p.priceRange.minVariantPrice.currencyCode}</div>
              </div>
            </Link>
          ))}
          <Link href={`/search?q=${encodeURIComponent(q)}`} onClick={() => setOpen(false)} style={{ display: "block", padding: "0.5rem", textAlign: "center", fontSize: "0.85rem", borderTop: "1px solid #eee", textDecoration: "none", color: "#111" }}>
            See all results for "{q}"
          </Link>
        </div>
      )}
    </div>
  );
}
