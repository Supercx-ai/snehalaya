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
  { key: "occasion_tags", label: "Occasion" },
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
    <div style={{ marginTop: "1rem" }}>
      {(isSilk || hasGI) && (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
          {isSilk && <Badge color="#7a5c00" bg="#fff3cd">Silk Mark Certified</Badge>}
          {hasGI && <Badge color="#0a5c36" bg="#d4f4e2">GI Tagged</Badge>}
        </div>
      )}

      {rows.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.4rem 0.5rem 0.4rem 0", color: "#888", width: "40%" }}>{r.label}</td>
                <td style={{ padding: "0.4rem 0" }}>{metafields[r.key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {metafields.craft_story && (
        <div style={{ marginTop: "1rem" }}>
          <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>The craft</h3>
          <p style={{ color: "#444", lineHeight: 1.6, margin: 0 }}>{metafields.craft_story}</p>
        </div>
      )}

      {metafields.care_instructions && (
        <details style={{ marginTop: "1rem" }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>Care instructions</summary>
          <p style={{ color: "#444", lineHeight: 1.6 }}>{metafields.care_instructions}</p>
        </details>
      )}
    </div>
  );
}

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 999, background: bg, color, fontSize: "0.8rem", fontWeight: 600 }}>
      {children}
    </span>
  );
}
