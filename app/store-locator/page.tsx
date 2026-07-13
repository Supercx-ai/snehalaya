// ponytail: placeholder addresses/hours/phone — swap with the real showroom details.
// Map embeds use Google's key-free "output=embed" iframe (no Maps API key needed).
// Upgrade to the official Embed API (needs NEXT_PUBLIC_GOOGLE_MAPS_KEY) only if you need custom markers/styling.
const STORES = [
  { city: "Chennai", address: "T. Nagar, Chennai, Tamil Nadu", hours: "10:30 AM – 8:30 PM, all days", phone: "+91 00000 00000" },
  { city: "Coimbatore", address: "RS Puram, Coimbatore, Tamil Nadu", hours: "10:30 AM – 8:30 PM, all days", phone: "+91 00000 00000" },
];

export default function StoreLocator() {
  return (
    <main>
      <h1 style={{ marginTop: 0 }}>Visit our showrooms</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
        {STORES.map((s) => (
          <div key={s.city}>
            <h2 style={{ marginBottom: "0.25rem" }}>{s.city}</h2>
            <p style={{ margin: "0 0 0.25rem", color: "#444" }}>{s.address}</p>
            <p style={{ margin: "0 0 0.25rem", color: "#444" }}>{s.hours}</p>
            <p style={{ margin: "0 0 0.75rem", color: "#444" }}>{s.phone}</p>
            <iframe
              title={`${s.city} store map`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`}
              style={{ width: "100%", height: 250, border: 0, borderRadius: 8 }}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
