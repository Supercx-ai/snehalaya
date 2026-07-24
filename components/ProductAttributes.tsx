import type { ProductMetafields } from "@/lib/shopify";

const ROWS: { key: keyof ProductMetafields; label: string }[] = [
  { key: "colour_primary", label: "Colour" },
  { key: "colour_secondary", label: "Secondary colour" },
  { key: "colour_border", label: "Border colour" },
  { key: "colour_pallu", label: "Pallu colour" },
  { key: "weave_type", label: "Weave" },
  { key: "zari_type", label: "Zari" },
  { key: "border_style", label: "Border style" },
  { key: "blouse_included", label: "Blouse included" },
  { key: "blouse_length", label: "Blouse length" },
  { key: "occasion_type", label: "Occasion" },
  { key: "ready_to_ship", label: "Ready to ship" },
  { key: "ship_days", label: "Ships in" },
];

// Renders only the fields that actually have a value — most will be empty until
// the store owner fills in Admin → Custom data → Products.
export default function ProductAttributes({ metafields }: { metafields: ProductMetafields }) {
  const rows = ROWS.filter((r) => metafields[r.key]);
  const isSilk = metafields.silk_mark === "true";
  const hasGI = metafields.gi_tag === "true";

  if (rows.length === 0 && !isSilk && !hasGI && !metafields.craft_story && !metafields.care_instructions) return null;

  return (
    <details className="group border-t border-border-strong py-4">
      <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-ink">
        Product Details
        <span className="text-ink-faint transition-transform group-open:rotate-180">⌄</span>
      </summary>

      <div className="mt-4">
        {(isSilk || hasGI) && (
          <div className="flex gap-2 mb-3">
            {isSilk && <Badge className="bg-[#fff3cd] text-[#7a5c00]">Silk Mark Certified</Badge>}
            {hasGI && <Badge className="bg-[#d4f4e2] text-[#0a5c36]">GI Tagged</Badge>}
          </div>
        )}

        {rows.length > 0 && (
          <table className="w-full border-collapse text-sm">
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-border-subtle">
                  <td className="py-2 pr-2 text-ink-faint w-2/5">{r.label}</td>
                  <td className="py-2 text-ink">{metafields[r.key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {metafields.craft_story && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-ink mb-1">The craft</h3>
            <p className="text-sm text-ink-subtle leading-relaxed whitespace-pre-wrap">{metafields.craft_story}</p>
          </div>
        )}

        {metafields.care_instructions && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-ink mb-1">Care instructions</h3>
            <p className="text-sm text-ink-subtle leading-relaxed">{metafields.care_instructions}</p>
          </div>
        )}
      </div>
    </details>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>;
}
