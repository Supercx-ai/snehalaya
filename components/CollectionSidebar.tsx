import Image from "next/image";
import Link from "next/link";
import type { ProductFilter } from "@/lib/shopify";

// The PLP comp's filter groups. Shopify's Storefront API only facets Price +
// whatever LIST filters the store exposes, so Occasion/Pattern/Type of Work/Size
// (and Shipping/Styles/Fabric) run as client-side keyword filters against
// title/tags, and Discount is computed from compareAt prices.
export const KEYWORD_GROUPS = [
  { param: "occ", title: "Occasion", options: ["Wedding", "Bridal", "Festive", "Party", "Everyday"] },
  { param: "pattern", title: "Pattern", options: ["Floral", "Checked", "Striped", "Temple Border", "Plain"] },
  { param: "work", title: "Type of Work", options: ["Zari", "Handloom", "Brocade", "Embroidery", "Printed"] },
  { param: "size", title: "Size", options: ["Free Size", "Blouse"] },
  { param: "ship", title: "Shipping Time", options: ["Ready to Ship", "Made to Order"] },
  { param: "style", title: "Styles", options: ["Traditional", "Contemporary", "Bridal"] },
  { param: "fabric", title: "Fabric/Material", options: ["Silk", "Cotton", "Linen", "Organza", "Georgette"] },
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
    <details className="group border-b border-[rgba(123,30,40,0.08)] py-3" open={defaultOpen}>
      <summary className="flex items-center justify-between cursor-pointer list-none text-[13px] font-medium text-[#333333]">
        {title}
        <Image src="/figma/icon-chevron.svg" alt="" width={10} height={10} className="group-open:rotate-180 transition-transform" />
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

function matchFilter(filters: ProductFilter[], ...names: string[]) {
  const lower = names.map((n) => n.toLowerCase());
  return filters.find((f) => lower.some((n) => f.label.toLowerCase().includes(n)));
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
  const colorFilter = matchFilter(listFilters, "color", "colour");
  const usedIds = new Set([colorFilter?.id]);
  const extraFilters = listFilters.filter((f) => !usedIds.has(f.id));
  const byTitle = Object.fromEntries(KEYWORD_GROUPS.map((g) => [g.title, g]));

  return (
    <div className="rounded-[6px] bg-[#fff2d8] px-5 pb-4 pt-1">
      <h2 className="border-b border-[rgba(123,30,40,0.17)] py-3 text-xl font-medium text-[#333333]">Filters</h2>

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

        {byTitle.Occasion && (
          <FilterGroup title="Occasion">
            <CheckList name={byTitle.Occasion.param} options={byTitle.Occasion.options} selected={keywordSelections[byTitle.Occasion.param] ?? []} />
          </FilterGroup>
        )}
        {byTitle.Pattern && (
          <FilterGroup title="Pattern">
            <CheckList name={byTitle.Pattern.param} options={byTitle.Pattern.options} selected={keywordSelections[byTitle.Pattern.param] ?? []} />
          </FilterGroup>
        )}

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

        {byTitle["Type of Work"] && (
          <FilterGroup title="Type of Work">
            <CheckList name={byTitle["Type of Work"].param} options={byTitle["Type of Work"].options} selected={keywordSelections[byTitle["Type of Work"].param] ?? []} />
          </FilterGroup>
        )}
        {byTitle.Size && (
          <FilterGroup title="Size">
            <CheckList name={byTitle.Size.param} options={byTitle.Size.options} selected={keywordSelections[byTitle.Size.param] ?? []} />
          </FilterGroup>
        )}

        {colorFilter && (
          <FilterGroup title="Color">
            <div className="flex flex-col gap-2.5 max-h-52 overflow-y-auto pr-1">
              {colorFilter.values.map((v) => (
                <label key={v.id} className="flex items-center gap-2 text-sm text-ink-secondary cursor-pointer">
                  <input type="checkbox" name="f" value={v.input} defaultChecked={selectedInputs.includes(v.input)} className="accent-burgundy w-4 h-4 shrink-0" />
                  <span className="flex-1">{v.label}</span>
                  <span className="text-ink-faint text-xs">({v.count})</span>
                </label>
              ))}
            </div>
          </FilterGroup>
        )}

        {byTitle["Shipping Time"] && (
          <FilterGroup title="Shipping Time">
            <CheckList name={byTitle["Shipping Time"].param} options={byTitle["Shipping Time"].options} selected={keywordSelections[byTitle["Shipping Time"].param] ?? []} />
          </FilterGroup>
        )}
        {byTitle.Styles && (
          <FilterGroup title="Styles">
            <CheckList name={byTitle.Styles.param} options={byTitle.Styles.options} selected={keywordSelections[byTitle.Styles.param] ?? []} />
          </FilterGroup>
        )}
        {byTitle["Fabric/Material"] && (
          <FilterGroup title="Fabric/Material">
            <CheckList name={byTitle["Fabric/Material"].param} options={byTitle["Fabric/Material"].options} selected={keywordSelections[byTitle["Fabric/Material"].param] ?? []} />
          </FilterGroup>
        )}

        {extraFilters.map((f) => (
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

      {showApply && (
        <button type="submit" className="mt-3 w-full h-11 rounded-md bg-burgundy text-cream text-sm font-medium">
          Apply Filters
        </button>
      )}
    </div>
  );
}
