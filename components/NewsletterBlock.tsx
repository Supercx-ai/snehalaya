import Image from "next/image";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

// Maroon newsletter band from the legal pages' Figma comp (T&C node 2505:2395):
// solid #67111A with the gold mandala pattern at 12%, unlike the homepage
// Newsletter's photo background. The form is always visible per the design;
// without SHOPIFY_STORE_DOMAIN it degrades to a same-page GET (no-op) instead
// of posting to Shopify's newsletter signup.
export default function NewsletterBlock() {
  return (
    <section className="relative overflow-hidden bg-burgundy py-16 px-6 md:px-12">
      <Image src="/figma/newsletter/pattern.png" alt="" fill className="object-cover opacity-[.12]" />

      <div className="relative max-w-[720px] mx-auto flex flex-col items-center gap-6 text-center">
        <h2 className="font-display font-light text-heading-sm md:text-[36px] leading-none text-white">
          Stay Close to Snehalayaa
        </h2>
        <p className="text-base text-cream">
          New collections, exclusive drops and heritage stories &mdash; delivered with grace.
        </p>

        <form
          {...(DOMAIN ? { action: `https://${DOMAIN}/contact#newsletter`, method: "post" } : {})}
          className="flex justify-center gap-3 md:gap-4 w-full max-w-[468px]"
        >
          {DOMAIN && (
            <>
              <input type="hidden" name="form_type" value="customer" />
              <input type="hidden" name="utf8" value="&#10003;" />
            </>
          )}
          <input
            type="email"
            name="contact[email]"
            required
            placeholder="Enter your email"
            className="h-[47px] w-full md:w-[320px] min-w-0 rounded-[4px] bg-white px-4 text-sm text-ink placeholder:text-ink-faint"
          />
          <button type="submit" className="h-[47px] px-8 rounded-[4px] bg-accent text-sm font-semibold text-white shrink-0">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
