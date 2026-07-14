import ClearCacheButton from "@/components/ClearCacheButton";

// Not linked from nav — bookmark /admin. Protected by CACHE_CLEAR_SECRET, not a real login;
// fine for one person hitting a button, not for a shared team login.
export default function AdminPage() {
  return (
    <main>
      <h1>Admin</h1>
      <p style={{ color: "#555" }}>Forces every cached product/collection/blog page to refetch from Shopify on next visit.</p>
      <ClearCacheButton />
    </main>
  );
}
