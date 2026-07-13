import Image from "next/image";
import Link from "next/link";
import { getCart } from "@/lib/cart";

// Reads the cart cookie → always per-visitor, never cached.
export default async function CartPage() {
  const cart = await getCart();

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <main>
        <h1>Your cart</h1>
        <p>It’s empty. <Link href="/">Browse products →</Link></p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 640 }}>
      <h1>Your cart</h1>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem" }}>
        {cart.lines.nodes.map((line) => (
          <li key={line.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {line.merchandise.product.featuredImage && (
              <Image
                src={line.merchandise.product.featuredImage.url}
                alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
                width={72}
                height={72}
                style={{ borderRadius: 8, objectFit: "cover" }}
              />
            )}
            <div style={{ flex: 1 }}>
              <strong>{line.merchandise.product.title}</strong>
              <div style={{ color: "#666" }}>
                {line.quantity} × {line.merchandise.price.amount} {line.merchandise.price.currencyCode}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
        <span style={{ fontSize: "1.1rem" }}>
          Subtotal: <strong>{cart.cost.subtotalAmount.amount} {cart.cost.subtotalAmount.currencyCode}</strong>
        </span>
        {/* Hand off to Shopify's hosted, PCI-compliant checkout. */}
        <a href={cart.checkoutUrl} style={{ padding: "0.75rem 1.5rem", background: "#111", color: "#fff", borderRadius: 8, textDecoration: "none" }}>
          Checkout
        </a>
      </div>
    </main>
  );
}
