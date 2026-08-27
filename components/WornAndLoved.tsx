import ReviewsWidget from "./ReviewsWidget";

const JUDGEME_CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN) && Boolean(process.env.NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN);

// ⚠️ PLACEHOLDER CONTENT — NOT REAL CUSTOMER REVIEWS.
// These four entries are the sample copy sitting in Figma node 2191:943; the names, cities
// and quotes are invented and the comp's photo wells are empty grey boxes. They exist so the
// section matches the comp during design review. Publishing invented testimonials as genuine
// customer feedback is deceptive (and regulated — FTC / CMA / India's CCPA rules on fake
// reviews), so before this storefront goes live either:
//   1. set NEXT_PUBLIC_JUDGEME_SHOP_DOMAIN + NEXT_PUBLIC_JUDGEME_PUBLIC_TOKEN, which swaps
//      this block out for the real Judge.me reviews automatically, or
//   2. replace every entry below with real, attributable customer reviews.
const PLACEHOLDER_TESTIMONIALS = [
  { stars: 4, quote: "Perfect for my wedding ceremony. The colour was exactly right.", name: "Priya R.", city: "Chennai" },
  { stars: 5, quote: "The virtual shopping session was incredible. It felt so personal.", name: "Ananya M.", city: "Bangalore" },
  { stars: 5, quote: "Found the exact blue Kanjivaram using the image search.", name: "Meera S.", city: "Hyderabad" },
  { stars: 4, quote: "Shipped to London in perfect condition. Beautiful packaging.", name: "Kavitha N.", city: "London" },
] as const;

function Stars({ filled }: { filled: number }) {
  return (
    <div className="flex gap-1" aria-label={`${filled} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="w-[15px] h-[15px]" fill={i <= filled ? "#b89552" : "none"} stroke="#b89552" strokeWidth="1.4" aria-hidden>
          <path d="M10 1.8l2.5 5.1 5.6.8-4 3.9 1 5.6L10 14.6l-5.1 2.6 1-5.6-4-3.9 5.6-.8z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

export default function WornAndLoved() {
  return (
    // Comp: node 2191:943 — heading, a 4-up testimonial row, then the CTA.
    <section className="px-4 md:px-[30px] py-12 text-center">
      <h2 className="font-display font-light text-heading-sm md:text-heading-xl text-ink">Worn &amp; Loved by You</h2>
      <p className="mt-2 text-base text-ink-subtle">Real customers. Real celebrations.</p>

      {JUDGEME_CONFIGURED ? (
        <div className="mt-10 text-left" id="judgeme-reviews">
          <ReviewsWidget />
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[22px]" id="judgeme-reviews">
          {PLACEHOLDER_TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-[8px] border border-border bg-white overflow-hidden text-left">
              {/* The comp leaves these wells empty — no invented customer photos go here. */}
              <div className="aspect-[282/242] w-full bg-border-subtle" aria-hidden />
              <figcaption className="flex flex-col gap-3 px-5 py-5">
                <Stars filled={t.stars} />
                <blockquote className="font-display text-xl leading-snug text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                <p className="text-sm">
                  <span className="font-semibold text-primary">{t.name}</span>
                  <span className="text-ink-subtle"> &middot; {t.city}</span>
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <a href="#judgeme-reviews" className="mt-8 inline-flex items-center justify-center h-[41px] px-8 rounded-sm bg-primary text-cream text-2xs font-semibold tracking-wide2 uppercase">
        View Customer Stories
      </a>
    </section>
  );
}
