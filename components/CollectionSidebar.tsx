import Image from "next/image";
import type { ProductFilter } from "@/lib/shopify";

// Accordion needs no client JS — <details>/<summary> is a native disclosure widget,
// and Tailwind's group-open: variant handles the chevron rotation.
function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-border-subtle py-4">
      <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-ink">
        {title}
        <Image src="/figma/icon-chevron.svg" alt="" width={10} height={10} className="group-open:rotate-180 transition-transform" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

export default function CollectionSidebar({
  filters, selectedInputs, minPrice, maxPrice,
}: { filters: ProductFilter[]; selectedInputs: string[]; minPrice?: string; maxPrice?: string }) {
  const listFilters = filters.filter((f) => f.type === "LIST");

  return (
    <div className="rounded-lg border border-border-strong bg-white">
      <div className="px-5 py-4 border-b border-border-strong">
        <h2 className="text-base font-medium text-ink">Filters</h2>
      </div>

      <div className="px-5">
        <FilterGroup title="Price">
          <div className="flex items-center gap-2">
            <input
              type="number" name="minPrice" placeholder="Min" defaultValue={minPrice}
              className="w-full h-9 px-3 rounded-sm border border-border-strong text-sm text-ink placeholder:text-ink-faint"
            />
            <span className="text-ink-faint">–</span>
            <input
              type="number" name="maxPrice" placeholder="Max" defaultValue={maxPrice}
              className="w-full h-9 px-3 rounded-sm border border-border-strong text-sm text-ink placeholder:text-ink-faint"
            />
          </div>
        </FilterGroup>

        {listFilters.map((f) => (
          <FilterGroup key={f.id} title={f.label}>
            <div className="flex flex-col gap-2.5 max-h-52 overflow-y-auto pr-1">
              {f.values.map((v) => (
                <label key={v.id} className="flex items-center gap-2 text-sm text-ink-secondary cursor-pointer">
                  <input type="checkbox" name="f" value={v.input} defaultChecked={selectedInputs.includes(v.input)} className="accent-primary w-4 h-4 shrink-0" />
                  <span className="flex-1">{v.label}</span>
                  <span className="text-ink-faint text-xs">({v.count})</span>
                </label>
              ))}
            </div>
          </FilterGroup>
        ))}
      </div>

      <div className="p-5">
        <button type="submit" className="w-full h-11 rounded-sm bg-primary text-cream text-sm font-medium">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
