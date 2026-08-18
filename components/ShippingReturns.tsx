function Check() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-4 h-4 mt-0.5 shrink-0 text-ink-secondary" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

// Static policy copy — update here if the actual shipping/returns terms change.
export default function ShippingReturns() {
  return (
    <details className="group border-t border-border py-5" open>
      <summary className="flex items-center justify-between cursor-pointer list-none text-xl text-ink">
        Shipping &amp; Returns
        <svg viewBox="0 0 24 24" aria-hidden className="w-4 h-4 text-ink-faint transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className="mt-4 text-sm text-ink-subtle leading-relaxed">
        <ul className="space-y-4">
          <li className="flex gap-3">
            <Check />
            <span>Free Shipping</span>
          </li>
          <li className="flex gap-3">
            <Check />
            <span>
              Returnable within 2 days of delivery (7 days for Diamond tier members). Custom-made orders
              are not returnable. Product&apos;s original tags, if attached, must be intact for a successful
              return. If the original tags are missing, Snehalayaa may decline the return request and send
              the product back to the customer. Return handling charges would be applicable
            </span>
          </li>
        </ul>
        <a href="/returns-exchange" className="mt-3 inline-block underline text-ink">More Details</a>
      </div>
    </details>
  );
}
