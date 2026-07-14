import Link from "next/link";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/session";
import { getOrders, customerAccountConfigured } from "@/lib/customerAccount";

export default async function OrdersPage() {
  if (!customerAccountConfigured) redirect("/account");

  const token = await getAccessToken();
  if (!token) redirect("/api/auth/login");

  const orders = await getOrders(token);

  return (
    <main>
      <h1>Order history</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #eee" }}>
              <th style={{ padding: "0.5rem 0" }}>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "0.5rem 0" }}>{o.name}</td>
                <td>{new Date(o.processedAt).toLocaleDateString()}</td>
                <td>{o.fulfillmentStatus ?? o.financialStatus ?? "—"}</td>
                <td>{o.totalPrice.amount} {o.totalPrice.currencyCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link href="/account" style={{ display: "inline-block", marginTop: "1.5rem" }}>← Back to account</Link>
    </main>
  );
}
