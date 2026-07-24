function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

// Real estimate: today + the ship_days metafield, not a fixed/fake date. Falls back to
// showing the raw metafield text if it isn't a plain number of days (e.g. "5-7 days").
export default function DeliveryEstimate({ shipDays }: { shipDays?: string }) {
  if (!shipDays) return null;
  const days = Number(shipDays);

  if (!Number.isFinite(days) || days <= 0) {
    return (
      <p className="mt-6 border border-border-strong rounded-sm px-4 py-3 text-sm text-ink">
        Ships in <strong className="font-medium">{shipDays}</strong>
      </p>
    );
  }

  const eta = new Date();
  eta.setDate(eta.getDate() + days);
  const formatted = `${ordinal(eta.getDate())} ${eta.toLocaleString("en-US", { month: "long" })}`;

  return (
    <p className="mt-6 border border-border-strong rounded-sm px-4 py-3 text-sm text-ink">
      Standard Delivery by <strong className="font-medium text-primary">{formatted}</strong>
    </p>
  );
}
