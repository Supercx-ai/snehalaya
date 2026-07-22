import Link from "next/link";
import { slugifyColour, colourSwatch } from "@/lib/colours";
import type { ColorFilterValue } from "@/lib/shopify";

export default function ColourPicker({ colours }: { colours: ColorFilterValue[] }) {
  if (colours.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
      {colours.map((c) => (
        <Link key={c.label} href={`/colours/${slugifyColour(c.label)}`} style={{ textAlign: "center", textDecoration: "none", color: "inherit" }}>
          <span
            style={{
              display: "block", width: 48, height: 48, borderRadius: "50%",
              background: colourSwatch(c.label), border: "1px solid #ddd", marginBottom: "0.3rem",
            }}
          />
          <span style={{ fontSize: "0.8rem" }}>{c.label} ({c.count})</span>
        </Link>
      ))}
    </div>
  );
}
