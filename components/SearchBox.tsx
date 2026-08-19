"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { instantSearch, topPicks } from "@/lib/search";
import type { Product } from "@/lib/shopify";
import LocalizedPrice from "./LocalizedPrice";
import WishlistHeart from "./WishlistHeart";
import ImageSearchModal from "./ImageSearchModal";

// Quick-search chips → real collections / weave PLPs where one exists, broad search otherwise.
const QUICK_SEARCHES = [
  { label: "Pre Draped Saree", href: "/search?q=Pre+Draped" },
  { label: "Kanjivaram Silk Saree", href: "/collections/kanjivaram-silk" },
  { label: "Banarasi Saree", href: "/weaves/banarasi" },
  { label: "Wedding Saree", href: "/collections/maharani-bridal-collection" },
  { label: "Bridal Collection", href: "/collections/maharani-bridal-collection" },
  { label: "New Arrivals", href: "/collections/new-arrival" },
  { label: "Lehenga", href: "/search?q=Lehenga" },
  { label: "Festive Wear", href: "/search?q=Festive" },
];

const PRICE_BANDS = [
  { label: "Under ₹1,000", max: 1000 },
  { label: "₹1,000 - ₹3,000", min: 1000, max: 3000 },
  { label: "₹3,000 - ₹7,000", min: 3000, max: 7000 },
  { label: "₹7,000 - ₹15,000", min: 7000, max: 15000 },
  { label: "Above ₹15,000", min: 15000 },
];

function priceHref(band: { min?: number; max?: number }) {
  const p = new URLSearchParams();
  if (band.min) p.set("minPrice", String(band.min));
  if (band.max) p.set("maxPrice", String(band.max));
  return `/collections/new-arrival?${p.toString()}`;
}

function badgeFor(tags: string[]): string | null {
  const t = tags.map((x) => x.toLowerCase());
  if (t.includes("best-seller") || t.includes("bestseller") || t.includes("best seller")) return "Best Seller";
  if (t.includes("exclusive")) return "Exclusive";
  if (t.some((x) => x.includes("ready"))) return "Ready to Ship";
  if (t.includes("new")) return "New Arrival";
  return null;
}

function discountPct(p: Product): number {
  const was = p.compareAtPriceRange?.minVariantPrice;
  if (!was) return 0;
  const wasN = Number(was.amount);
  const now = Number(p.priceRange.minVariantPrice.amount);
  return wasN > now ? Math.round(((wasN - now) / wasN) * 100) : 0;
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4 text-burgundy" aria-hidden>
      <path d="M3.5 3.5h8l9 9-8 8-9-9v-8Z" />
      <circle cx="8" cy="8" r="1.3" />
    </svg>
  );
}

function ResultCard({ p, onNavigate }: { p: Product; onNavigate: () => void }) {
  const badge = badgeFor(p.tags ?? []);
  const off = discountPct(p);
  const was = p.compareAtPriceRange?.minVariantPrice;
  return (
    <Link href={`/products/${p.handle}`} onClick={onNavigate} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[8px] bg-border-subtle">
        {p.featuredImage && (
          <Image src={p.featuredImage.url} alt={p.featuredImage.altText ?? p.title} fill sizes="220px" className="object-cover" />
        )}
        <span className="absolute right-2 top-2">
          <WishlistHeart
            plp
            item={{
              handle: p.handle,
              title: p.title,
              image: p.featuredImage?.url ?? null,
              amount: p.priceRange.minVariantPrice.amount,
              currencyCode: p.priceRange.minVariantPrice.currencyCode,
            }}
          />
        </span>
      </div>
      {badge && (
        <span className="mt-2 inline-block rounded-full bg-[#f9efec] px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.4px] text-burgundy">
          {badge}
        </span>
      )}
      <p className="mt-1.5 text-[13px] leading-snug text-ink line-clamp-1">{p.title}</p>
      <p className="mt-1 flex items-center gap-1.5 text-[13px]">
        <span className="font-bold text-ink">
          <LocalizedPrice handle={p.handle} amount={p.priceRange.minVariantPrice.amount} currencyCode={p.priceRange.minVariantPrice.currencyCode} format="currency" />
        </span>
        {off > 0 && was && (
          <>
            <span className="text-[11px] text-[#999] line-through">
              <LocalizedPrice handle={p.handle} amount={was.amount} currencyCode={was.currencyCode} format="currency" />
            </span>
            <span className="text-[11px] font-semibold text-[#c0392b]">{off}% OFF</span>
          </>
        )}
      </p>
    </Link>
  );
}

export default function SearchBox({ bare }: { bare?: boolean } = {}) {
  const [q, setQ] = useState("");
  const [live, setLive] = useState<Product[]>([]);
  const [top, setTop] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [imgOpen, setImgOpen] = useState(false);
  const [panelTop, setPanelTop] = useState(0);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const loadedTop = useRef(false);

  const products = q.trim().length >= 2 && live.length > 0 ? live : top;

  const reposition = useCallback(() => {
    const r = formRef.current?.getBoundingClientRect();
    if (r) setPanelTop(r.bottom + 8);
  }, []);

  const openPanel = useCallback(() => {
    reposition();
    setOpen(true);
    if (!loadedTop.current) {
      loadedTop.current = true;
      topPicks().then(setTop).catch(() => setTop([]));
    }
  }, [reposition]);

  // Live results as the visitor types (debounced).
  useEffect(() => {
    if (q.trim().length < 2) { setLive([]); return; }
    const id = setTimeout(() => instantSearch(q).then(setLive).catch(() => setLive([])), 250);
    return () => clearTimeout(id);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => reposition();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node) && !(e.target as HTMLElement).closest?.("[data-search-panel]")) setOpen(false);
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", reposition);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", reposition);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, reposition]);

  const close = () => setOpen(false);
  const go = (href: string) => { close(); router.push(href); };

  return (
    <div ref={boxRef} className={bare ? "flex-1 min-w-0" : "relative flex-1 min-w-0 max-w-[496px]"}>
      <form
        ref={formRef}
        onSubmit={(e) => { e.preventDefault(); close(); router.push(`/search?q=${encodeURIComponent(q)}`); }}
        className={`flex items-center h-[48px] pl-4 pr-1 ${bare ? "" : "bg-white border border-border-strong rounded-md"}`}
      >
        <Image src="/figma/icon-search.svg" alt="" width={18} height={18} className="shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={openPanel}
          onClick={openPanel}
          placeholder="Search for sarees, collections and more"
          className="flex-1 min-w-0 border-0 outline-none px-3 text-md text-ink placeholder:text-ink-faint bg-transparent"
        />
        <button
          type="button"
          onClick={() => { setOpen(false); setImgOpen(true); }}
          aria-label="Image Search"
          className="flex items-center gap-1.5 shrink-0 border-l border-border pl-3 pr-2 py-3 text-base text-ink-muted whitespace-nowrap"
        >
          <Image src="/figma/icon-image-search.svg" alt="" width={16} height={16} />
          <span>Image Search</span>
        </button>
      </form>

      <ImageSearchModal open={imgOpen} onClose={() => setImgOpen(false)} />

      {open && (
        <>
          <div className="fixed inset-0 z-40" onMouseDown={close} />
          <div
            data-search-panel
            style={{ top: panelTop }}
            className="fixed left-1/2 z-50 w-[min(1200px,94vw)] -translate-x-1/2 overflow-hidden rounded-[12px] border border-[#eee6da] bg-white shadow-[0_24px_48px_rgba(23,23,23,0.18)]"
          >
            <div className="max-h-[calc(100vh-160px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
                {/* Quick Searches + Price Range */}
                <div className="border-b lg:border-b-0 lg:border-r border-[#f0e9de] px-6 py-6">
                  <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink">
                    <TagIcon /> Quick Searches
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {QUICK_SEARCHES.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => go(s.href)}
                        className="rounded-[8px] border border-[#e3ded4] px-3.5 py-2 text-[13px] text-ink hover:border-burgundy hover:text-burgundy"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <h3 className="mt-7 flex items-center gap-2 text-[15px] font-bold text-ink">
                    <TagIcon /> Price Range
                  </h3>
                  <div className="mt-4" aria-hidden>
                    <div className="relative h-1 rounded-full bg-[#e8e0d5]">
                      <span className="absolute left-0 top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-burgundy" />
                      <span className="absolute right-0 top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-burgundy" />
                    </div>
                    <div className="mt-2 flex justify-between text-[12px] text-[#666]">
                      <span>₹500</span>
                      <span>₹1,50,000+</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {PRICE_BANDS.map((b) => (
                      <button
                        key={b.label}
                        type="button"
                        onClick={() => go(priceHref(b))}
                        className="rounded-[8px] border border-[#e3ded4] px-3 py-1.5 text-[12px] text-ink hover:border-burgundy hover:text-burgundy"
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Results / live results */}
                <div className="px-6 py-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[15px] font-bold text-ink">
                      {q.trim().length >= 2 ? `Results for “${q.trim()}”` : "Top Results"}
                    </h3>
                    <Link
                      href={`/search?q=${encodeURIComponent(q)}`}
                      onClick={close}
                      className="flex items-center gap-1.5 text-[13px] font-medium text-burgundy"
                    >
                      View all results
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden>
                        <path d="M4 12h15M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </div>

                  {products.length > 0 ? (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-5">
                      {products.map((p) => <ResultCard key={p.id} p={p} onNavigate={close} />)}
                    </div>
                  ) : (
                    <p className="mt-6 text-[13px] text-[#888]">
                      {q.trim().length >= 2 ? "No matching sarees — try a different term." : "Loading top picks…"}
                    </p>
                  )}
                </div>
              </div>

              {/* Image-search bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 border-t border-[#f0e9de] bg-[#faf7f2] px-6 py-4">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#f9efec] text-burgundy shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5" aria-hidden>
                    <path d="M4 8V6.5a1.5 1.5 0 0 1 1.5-1.5H8l1-1.5h6L16 5h2.5A1.5 1.5 0 0 1 20 6.5V8" />
                    <rect x="3" y="8" width="18" height="12" rx="2" />
                    <circle cx="12" cy="13.5" r="3.2" />
                  </svg>
                </span>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-[14px] font-semibold text-ink">Can&apos;t find what you&apos;re looking for?</p>
                  <p className="text-[12.5px] text-[#777]">Search using an image and we&apos;ll find similar styles for you.</p>
                </div>
                <button
                  type="button"
                  onClick={() => { close(); setImgOpen(true); }}
                  className="flex items-center justify-center gap-2 h-11 px-6 rounded-[6px] bg-burgundy text-cream text-[13px] font-semibold"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4" aria-hidden>
                    <path d="M4 8V6.5a1.5 1.5 0 0 1 1.5-1.5H8l1-1.5h6L16 5h2.5A1.5 1.5 0 0 1 20 6.5V8" />
                    <rect x="3" y="8" width="18" height="12" rx="2" />
                    <circle cx="12" cy="13.5" r="3.2" />
                  </svg>
                  Search by Image
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="flex items-center justify-center h-11 px-6 rounded-[6px] border border-burgundy text-[13px] font-semibold text-burgundy"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
