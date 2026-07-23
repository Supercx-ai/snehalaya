import ReviewsWidget from "./ReviewsWidget";

// Figma's mock testimonials (grey placeholder photos, invented names/cities) aren't real
// customer data — rendering them would fabricate reviews on a production storefront. This
// wraps the real Judge.me widget instead; it's empty until Judge.me is configured, same as
// the rest of the site's not-yet-configured integrations (WhatsApp, Instagram).
export default function WornAndLoved() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-9 py-12 text-center">
      <h2 className="font-display font-light text-heading-sm md:text-heading-xl text-ink">Worn &amp; Loved by You</h2>
      <p className="mt-2 text-base text-ink-subtle">Real customers. Real celebrations.</p>

      <div className="mt-10 text-left" id="judgeme-reviews">
        <ReviewsWidget />
      </div>

      <a href="#judgeme-reviews" className="mt-8 inline-flex items-center justify-center h-[41px] px-8 rounded-sm bg-primary text-cream text-2xs font-semibold tracking-wide2 uppercase">
        View Customer Stories
      </a>
    </section>
  );
}
