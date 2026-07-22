"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import type { Product } from "@/lib/shopify";

export default function ImageSearchUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setPending(true);
    setError(null);
    setProducts(null);

    const form = new FormData();
    form.append("image", file);
    const res = await fetch("/api/image-search", { method: "POST", body: form });
    const data = await res.json();

    setPending(false);
    if (!res.ok) { setError(data.error ?? "Search failed"); return; }
    setProducts(data.products);
  }

  return (
    <div>
      <label
        style={{
          display: "block", border: "2px dashed #ccc", borderRadius: 8, padding: "2rem",
          textAlign: "center", cursor: "pointer", marginBottom: "1.5rem",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          style={{ display: "none" }}
        />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL, not a remote/optimizable image
          <img src={preview} alt="Uploaded" style={{ maxWidth: 200, maxHeight: 200, borderRadius: 8 }} />
        ) : (
          <span style={{ color: "#666" }}>Click to upload a photo of a saree you like</span>
        )}
      </label>

      {pending && <p>Searching…</p>}
      {error && <p style={{ color: "#c00" }}>{error}</p>}
      {products && (products.length > 0 ? <ProductGrid products={products} /> : <p>No similar products found.</p>)}
    </div>
  );
}
