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
            <svg viewBox="0 0 24 24" aria-hidden className="w-4 h-4 shrink-0 text-ink" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-ink-secondary">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
