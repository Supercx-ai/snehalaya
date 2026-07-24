const BADGES = [
  "Loved by 2 Million+ Customers",
  "Trusted in Fashion for 20 Years",
  "Authentic Designer Labels",
  "75+ Countries Served",
  "Personalized Styling Assistance",
  "Exclusive Member Benefits",
];

export default function TrustBadges() {
  return (
    <div className="border-t border-border-strong pt-5">
      <h3 className="text-sm font-medium text-ink mb-4">Shop with Confidence</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {BADGES.map((label) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full border border-ink-secondary text-ink-secondary text-xs shrink-0">✓</span>
            <span className="text-sm text-ink-secondary">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
