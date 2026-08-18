"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "best-selling", label: "Best selling" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
];

// baseQuery is the current filter/price query string (built server-side) — sort changes
// apply immediately by re-navigating with it, instead of waiting on the filters' Apply button.
export default function SortSelect({ basePath, currentSort, baseQuery }: { basePath: string; currentSort: string; baseQuery: string }) {
  const router = useRouter();

  function onChange(value: string) {
    const params = new URLSearchParams(baseQuery);
    if (value) params.set("sort", value); else params.delete("sort");
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className="relative shrink-0">
      <select
        defaultValue={currentSort}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-9 w-full md:w-[293px] pl-4 pr-9 rounded-[7px] border border-[#e6e6e6] bg-white text-sm text-ink cursor-pointer"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>Sort By : {o.label}</option>
        ))}
      </select>
      <Image src="/figma/icon-chevron.svg" alt="" width={10} height={10} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
    </div>
  );
}
