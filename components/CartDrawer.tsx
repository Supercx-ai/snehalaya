"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { getUpsell } from "@/lib/cart";
import { gaEvent } from "@/lib/gtag";
import type { Product } from "@/lib/shopify";

export default function CartDrawer() {
  const { cart, open, setOpen, pending, updateLine, removeLine, applyCode } = useCart();
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState<string | null>(null);
  const [upsell, setUpsell] = useState<Product[]>([]);

  const firstProductId = cart?.lines.nodes[0]?.merchandise.product.id;
  useEffect(() => {
    if (open && firstProductId) getUpsell(firstProductId).then(setUpsell).catch(() => setUpsell([]));
  }, [open, firstProductId]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100 }}>
      <div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.4)" }} />
      <aside style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(420px, 100vw)", background: "#fff", display: "flex", flexDirection: "column", boxShadow: "-4px 0 16px rgba(0,0,0,.15)" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: "1px solid #eee" }}>
          <strong>Your cart</strong>
          <button onClick={() => setOpen(false)} style={{ border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer" }}>×</button>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {!cart || cart.lines.nodes.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "1rem" }}>
              {cart.lines.nodes.map((line) => (
                <li key={line.id} style={{ display: "flex", gap: "0.75rem" }}>
                  {line.merchandise.product.featuredImage && (
                    <Image src={line.merchandise.product.featuredImage.url} alt="" width={64} height={64} style={{ borderRadius: 6, objectFit: "cover" }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{line.merchandise.product.title}</div>
                    <div style={{ color: "#666", fontSize: "0.9rem" }}>{line.merchandise.price.amount} {line.merchandise.price.currencyCode}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                      <button disabled={pending} onClick={() => updateLine(line.id, Math.max(1, line.quantity - 1))} style={qtyBtn}>−</button>
                      <span>{line.quantity}</span>
                      <button disabled={pending} onClick={() => updateLine(line.id, line.quantity + 1)} style={qtyBtn}>+</button>
                      <button disabled={pending} onClick={() => removeLine(line.id)} style={{ marginLeft: "auto", border: "none", background: "none", color: "#c00", cursor: "pointer" }}>Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {upsell.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>You might also like</div>
              <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto" }}>
                {upsell.map((p) => (
                  <Link key={p.id} href={`/products/${p.handle}`} onClick={() => setOpen(false)} style={{ minWidth: 100, textDecoration: "none", color: "inherit" }}>
                    {p.featuredImage && <Image src={p.featuredImage.url} alt={p.title} width={100} height={100} style={{ borderRadius: 6, objectFit: "cover" }} />}
                    <div style={{ fontSize: "0.8rem", marginTop: "0.25rem" }}>{p.title}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {cart && cart.lines.nodes.length > 0 && (
          <footer style={{ padding: "1rem", borderTop: "1px solid #eee" }}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const ok = await applyCode(code);
                setCodeMsg(ok ? "Applied!" : "Invalid code");
              }}
              style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}
            >
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" style={{ flex: 1, padding: "0.5rem", border: "1px solid #ccc", borderRadius: 6 }} />
              <button type="submit" disabled={pending || !code} style={{ padding: "0.5rem 1rem", borderRadius: 6, border: "1px solid #111", background: "#fff", cursor: "pointer" }}>Apply</button>
            </form>
            {codeMsg && <p style={{ fontSize: "0.85rem", margin: "0 0 0.5rem", color: codeMsg === "Applied!" ? "#2a7" : "#c00" }}>{codeMsg}</p>}

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span>Total</span>
              <strong>{cart.cost.totalAmount.amount} {cart.cost.totalAmount.currencyCode}</strong>
            </div>
            <a
              href={cart.checkoutUrl}
              onClick={() =>
                gaEvent("begin_checkout", {
                  currency: cart.cost.totalAmount.currencyCode,
                  value: Number(cart.cost.totalAmount.amount),
                  items: cart.lines.nodes.map((l) => ({
                    item_id: l.merchandise.id,
                    item_name: l.merchandise.product.title,
                    price: Number(l.merchandise.price.amount),
                    quantity: l.quantity,
                  })),
                })
              }
              style={{ display: "block", textAlign: "center", padding: "0.85rem", background: "#111", color: "#fff", borderRadius: 8, textDecoration: "none" }}
            >
              Checkout
            </a>
          </footer>
        )}
      </aside>
    </div>
  );
}

const qtyBtn: React.CSSProperties = { width: 24, height: 24, border: "1px solid #ccc", borderRadius: 4, background: "#fff", cursor: "pointer" };
