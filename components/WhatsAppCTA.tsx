// No API key needed — wa.me deep links work with just a phone number.
const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export default function WhatsAppCTA({ text = "Hi! I have a question about your sarees." }: { text?: string }) {
  if (!NUMBER) return null; // ponytail: hidden until NEXT_PUBLIC_WHATSAPP_NUMBER is set
  const href = `https://wa.me/${NUMBER}?text=${encodeURIComponent(text)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed", right: 20, bottom: 20, zIndex: 50,
        display: "flex", alignItems: "center", gap: 8,
        padding: "0.75rem 1.1rem", borderRadius: 999,
        background: "#25D366", color: "#fff", textDecoration: "none",
        fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,.2)",
      }}
    >
      WhatsApp Us
    </a>
  );
}
