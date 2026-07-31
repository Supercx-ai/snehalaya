// Visual only — steps 2/3 happen on Shopify's own hosted checkout, not on this site,
// so this just orients the shopper in the overall journey rather than being interactive.
function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" />
      <circle cx="9" cy="20" r="1.3" />
      <circle cx="17" cy="20" r="1.3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

const STEPS = [
  { label: "Cart", icon: CartIcon },
  { label: "Shipping", icon: PinIcon },
  { label: "Payment", icon: CardIcon },
];

export default function CartProgressSteps() {
  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center ${
                i === 0 ? "bg-primary text-white" : "border border-border-strong text-ink-faint"
              }`}
            >
              <step.icon />
            </div>
            <span className={`text-[11px] tracking-wide2 uppercase ${i === 0 ? "text-primary font-medium" : "text-ink-faint"}`}>
              {i + 1}. {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && <div className={`w-16 md:w-24 h-px mb-5 ${i === 0 ? "bg-primary" : "bg-border-strong"}`} />}
        </div>
      ))}
    </div>
  );
}
