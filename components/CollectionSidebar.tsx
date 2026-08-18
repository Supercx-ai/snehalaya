import Image from "next/image";
import Link from "next/link";
import type { ProductFilter } from "@/lib/shopify";

// The PLP comp's seven filter groups. Shopify's Storefront API only facets Price +
// whatever LIST filters the store exposes, so Occasion/Pattern/Type of Work/Size run
// as client-side keyword filters against title/tags (this store's titles are richly
// descriptive), and Discount is computed from compareAt prices. Keyword values are
// curated for the saree domain.
export const KEYWORD_GROUPS = [
  { param: "occ", title: "Occasion", options: ["Wedding", "Bridal", "Festive", "Party", "Everyday"] },
  { param: "pattern", title: "Pattern", options: ["Floral", "Checked", "Striped", "Temple Border", "Plain"] },
  { param: "work", title: "Type of Work", options: ["Zari", "Handloom", "Brocade", "Embroidery", "Printed"] },
  { param: "size", title: "Size", options: ["Free Size", "Blouse"] },
] as const;

const DISCOUNTS = [
  { value: "10", label: "10% or more" },
  { value: "25", label: "25% or more" },
  { value: "50", label: "50% or more" },
] as const;

// Accordion needs no client JS — <details>/<summary> is a native disclosure widget,
// and Tailwind's group-open: variant handles the chevron rotation.
// Comp styling: Manrope Medium 18 "Filters", Manrope Medium 13 rows, #333333.
function FilterGroup({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group py-[15px]" open={defaultOpen}>
      <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-[#333333]">
        {title}
        <Image src="/figma/icon-chevron.svg" alt="" width={11} height={11} className="group-open:rotate-180 transition-transform" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function CheckList({ name, options, selected }: { name: string; options: readonly string[]; selected: string[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2 text-sm text-ink-secondary cursor-pointer">
          <input type="checkbox" name={name} value={o} defaultChecked={selected.includes(o)} className="accent-burgundy w-4 h-4 shrink-0" />
          {o}
        </label>
      ))}
    </div>
  );
}

export default function CollectionSidebar({
  filters,
  selectedInputs,
  minPrice,
  maxPrice,
  collections,
  keywordSelections = {},
  discount,
  showApply = true,
}: {
  filters: ProductFilter[];
  selectedInputs: string[];
  minPrice?: string;
  maxPrice?: string;
  /** "Sub Category" group — links into the collections. */
  collections?: { handle: string; title: string }[];
  /** Currently-selected values per keyword param (occ/pattern/work/size). */
  keywordSelections?: Record<string, string[]>;
  /** Currently-selected minimum discount %. */
  discount?: string;
  showApply?: boolean;
}) {
  const listFilters = filters.filter((f) => f.type === "LIST");

  return (
    <div className="rounded-[10px] bg-[#faf3e3] px-5 pb-5 pt-4">
      <h2 className="py-1 text-xl font-medium text-[#333333]">Filters</h2>

      <div>
        {collections && collections.length > 0 && (
          <FilterGroup title="Sub Category">
            <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
              {collections.map((c) => (
                <Link key={c.handle} href={`/collections/${c.handle}`} className="text-sm text-ink-secondary hover:text-burgundy">
                  {c.title}
                </Link>
              ))}
            </div>
          </FilterGroup>
        )}

        {KEYWORD_GROUPS.slice(0, 2).map((g) => (
          <FilterGroup key={g.param} title={g.title}>
            <CheckList name={g.param} options={g.options} selected={keywordSelections[g.param] ?? []} />
          </FilterGroup>
        ))}

        {showApply && (
          <FilterGroup title="Price">
            <div className="flex items-center gap-2">
              <input
                type="number" name="minPrice" placeholder="Min" defaultValue={minPrice}
                className="w-full h-9 px-3 rounded-sm border border-border bg-white text-sm text-ink placeholder:text-ink-faint"
              />
              <span className="text-ink-faint">&ndash;</span>
              <input
                type="number" name="maxPrice" placeholder="Max" defaultValue={maxPrice}
                className="w-full h-9 px-3 rounded-sm border border-border bg-white text-sm text-ink placeholder:text-ink-faint"
              />
            </div>
          </FilterGroup>
        )}

        <FilterGroup title="Discount">
          <div className="flex flex-col gap-2.5">
            {DISCOUNTS.map((d) => (
              <label key={d.value} className="flex items-center gap-2 text-sm text-ink-secondary cursor-pointer">
                <input type="radio" name="disc" value={d.value} defaultChecked={discount === d.value} className="accent-burgundy w-4 h-4 shrink-0" />
                {d.label}
              </label>
            ))}
          </div>
        </FilterGroup>

        {KEYWORD_GROUPS.slice(2).map((g) => (
          <FilterGroup key={g.param} title={g.title}>
            <CheckList name={g.param} options={g.options} selected={keywordSelections[g.param] ?? []} />
          </FilterGroup>
        ))}

        {listFilters.map((f) => (
          <FilterGroup key={f.id} title={f.label}>
            <div className="flex flex-col gap-2.5 max-h-52 overflow-y-auto pr-1">
              {f.values.map((v) => (
                <label key={v.id} className="flex items-center gap-2 text-sm text-ink-secondary cursor-pointer">
                  <input type="checkbox" name="f" value={v.input} defaultChecked={selectedInputs.includes(v.input)} className="accent-burgundy w-4 h-4 shrink-0" />
                  <span className="flex-1">{v.label}</span>
                  <span className="text-ink-faint text-xs">({v.count})</span>
                </label>
              ))}
            </div>
          </FilterGroup>
        ))}
      </div>

      <button type="submit" className="mt-2 w-full h-11 rounded-md bg-burgundy text-cream text-sm font-medium">
        Apply Filters
      </button>
    </div>
  );
}
