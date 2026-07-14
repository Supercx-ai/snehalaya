import Link from "next/link";
import { COLOUR_FAMILIES } from "@/lib/colours";

export default function ColourPicker() {
  return (
    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
      {COLOUR_FAMILIES.map((c) => (
        <Link key={c.slug} href={`/colours/${c.slug}`} style={{ textAlign: "center", textDecoration: "none", color: "inherit" }}>
          <span
            style={{
              display: "block", width: 48, height: 48, borderRadius: "50%",
              background: c.hex, border: "1px solid #ddd", marginBottom: "0.3rem",
            }}
          />
          <span style={{ fontSize: "0.8rem" }}>{c.name}</span>
        </Link>
      ))}
    </div>
  );
}
