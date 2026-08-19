import { getAnnouncementBar } from "@/lib/shopify";

export default async function AnnouncementBar() {
  const bar = await getAnnouncementBar();
  if (!bar?.message) return null; // nothing until the metaobject exists in Admin

  return (
    <div style={{ background: "#67111a", color: "#fff", textAlign: "center", padding: "0.5rem", fontSize: "0.85rem" }}>
      {bar.link ? <a href={bar.link} style={{ color: "#fff" }}>{bar.message}</a> : bar.message}
    </div>
  );
}
