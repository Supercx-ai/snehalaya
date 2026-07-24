// Static policy copy — update here if the actual shipping/returns terms change.
export default function ShippingReturns() {
  return (
    <details className="group border-t border-border-strong py-4" open>
      <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-ink">
        Shipping &amp; Returns
        <span className="text-ink-faint transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="mt-4 text-sm text-ink-subtle leading-relaxed space-y-3">
        <p><strong className="text-ink">Free shipping</strong> across India on all orders.</p>
        <p>
          Returnable within 2 days of delivery. Custom-made orders are not returnable. The product&apos;s
          original tags, if attached, must be intact for a successful return — if the original tags are
          missing, Snehalayaa may decline the return request and send the product back to the customer.
          Return handling charges would be applicable.
        </p>
      </div>
    </details>
  );
}
