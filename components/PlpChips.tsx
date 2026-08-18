"use client";

import { useRouter } from "next/navigation";

// Quick-toggle chips from the PLP comp (MacBook Air - 5): "✨ New" and "On Sale".
// New maps to the newest sort; On Sale to the client-side sale filter (?sale=1) —
// Shopify's Storefront API has no server-side on-sale product filter.
function chipClass(active: boolean) {
  return `inline-flex items-center gap-[7px] h-[35px] px-3 rounded-[5px] border bg-white text-[13px] font-medium transition-colors ${
    active ? "border-burgundy text-burgundy" : "border-[#e6e6e6] text-[#333]"
  }`;
}

export default function PlpChips({
  basePath,
  query,
  currentSort,
  saleActive,
}: {
  basePath: string;
  /** Full current query string — chips toggle one key and keep the rest. */
  query: string;
  currentSort: string;
  saleActive: boolean;
}) {
  const router = useRouter();
  const newActive = currentSort === "newest";

  function toggle(mutate: (p: URLSearchParams) => void) {
    const params = new URLSearchParams(query);
    mutate(params);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className={chipClass(newActive)}
        onClick={() => toggle((p) => (newActive ? p.delete("sort") : p.set("sort", "newest")))}
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" className="w-[15px] h-[15px]">
          <path d="M9 2.5 10.3 6 13.8 7.3 10.3 8.6 9 12.1 7.7 8.6 4.2 7.3 7.7 6 9 2.5Z" />
          <path d="M3.6 10.6l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6Z" />
        </svg>
        New
      </button>
      <button
        type="button"
        className={chipClass(saleActive)}
        onClick={() => toggle((p) => (saleActive ? p.delete("sale") : p.set("sale", "1")))}
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="#b89552" strokeWidth="1.2" className="w-[15px] h-[15px]">
          <path d="M8 1.5l1.5 1.3 2-.3.7 1.9 1.9.7-.3 2L15.1 8l-1.3 1.5.3 2-1.9.7-.7 1.9-2-.3L8 15.1l-1.5-1.3-2 .3-.7-1.9-1.9-.7.3-2L.9 8l1.3-1.5-.3-2 1.9-.7.7-1.9 2 .3L8 1.5Z" strokeLinejoin="round" />
          <path d="m6 10 4-4" strokeLinecap="round" />
          <circle cx="6.2" cy="6.2" r="0.5" fill="#b89552" />
          <circle cx="9.8" cy="9.8" r="0.5" fill="#b89552" />
        </svg>
        On Sale
      </button>
    </div>
  );
}
