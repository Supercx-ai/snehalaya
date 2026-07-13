// Wishlist Plus (Swym) — swap this stub for their SDK/snippet once the app is installed.
// https://swymcorp.com/docs/
const ENABLED = process.env.NEXT_PUBLIC_WISHLIST_PLUS_ENABLED === "true";

export default function WishlistButton() {
  return (
    <button
      type="button"
      disabled={!ENABLED}
      title={ENABLED ? undefined : "Wishlist Plus not connected yet"}
      style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #ccc", background: "#fff", cursor: ENABLED ? "pointer" : "not-allowed", opacity: ENABLED ? 1 : 0.5 }}
    >
      ♡ Wishlist
    </button>
  );
}
