import Image from "next/image";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

// Both the signup form and the WhatsApp button used to be gated behind their env vars, so
// on a build without them the section rendered as a headline over a photo and nothing else.
// They are part of the comp, so they always render now and degrade instead (same approach
// NewsletterBlock already takes on the legal pages).

// Posts straight to Shopify's own hosted customer-signup endpoint (classic /contact#newsletter
// form) — no API token or server code needed, works even for a headless storefront.
export default function Newsletter() {
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      <Image src="/figma/newsletter/bg.png" alt="" fill className="object-cover -z-20" />
      <div className="absolute inset-0 bg-black/[.67] -z-10" />
      <Image src="/figma/newsletter/pattern.png" alt="" fill className="object-cover opacity-[.14] -z-10" />

      <div className="relative max-w-[720px] mx-auto text-center">
        <h2 className="font-display font-light text-heading-sm md:text-8xl text-cream">Stay Close to Snehalayaa</h2>
        <p className="mt-4 text-base text-cream/85">New collections, exclusive drops and stories — delivered with grace.</p>

        {/* Figma's mobile frame keeps the email field and button side-by-side rather than
            stacked — the input just shrinks (min-w-0) to make room for the button. */}
        <form
          {...(DOMAIN ? { action: `https://${DOMAIN}/contact#newsletter`, method: "post" } : {})}
          className="mt-8 flex justify-center gap-2 md:gap-3 max-w-[520px] mx-auto"
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
            className="h-[46px] md:h-[54px] w-full md:w-[352px] min-w-0 max-w-full rounded-sm bg-cream px-4 md:px-5 text-sm text-ink placeholder:text-ink-faint"
          />
          <button type="submit" className="h-[46px] md:h-[54px] px-5 md:px-8 rounded-sm bg-accent text-2xs md:text-xs font-bold tracking-wide2 shrink-0">
            Subscribe
          </button>
        </form>

        <a
          href={WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "/contact-us"}
          {...(WHATSAPP_NUMBER ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-6 inline-flex items-center gap-2 h-[42px] px-6 rounded-md border border-[#8df492] bg-white/10 backdrop-blur-md text-sm text-[#f1fff1] tracking-wide2"
        >
          <Image src="/figma/newsletter/icon-whatsapp.png" alt="" width={21} height={21} />
          Join us on WhatsApp
        </a>
      </div>
    </section>
  );
}
