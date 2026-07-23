import Image from "next/image";

const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

const FEATURES = [
  { icon: "/figma/live-shopping/icon-guidance.png", label: "Personalized Guidance" },
  { icon: "/figma/live-shopping/icon-video.png", label: "Real-time Experience" },
  { icon: "/figma/live-shopping/icon-experts.png", label: "Trusted Experts" },
  { icon: "/figma/live-shopping/icon-private.png", label: "Secure & Private" },
] as const;

// "Book a Session" routes through the same WhatsApp number as the site's floating CTA
// (components/WhatsAppCTA.tsx) — no separate booking backend exists, and this is how the
// brand already handles direct customer contact.
export default function LiveShoppingPromo() {
  const bookingHref = NUMBER
    ? `https://wa.me/${NUMBER}?text=${encodeURIComponent("Hi! I'd like to book a live video shopping session.")}`
    : null;

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-9 py-12">
      <div className="relative rounded-[25px] border border-accent overflow-hidden bg-cream shadow-[0_18px_36px_-18px_rgba(0,0,0,0.3)] px-5 py-8 md:px-10 grid md:grid-cols-[1fr_1fr] gap-6 md:gap-10 items-center">
        <Image src="/figma/find/pattern-texture.png" alt="" fill className="absolute inset-0 object-cover opacity-10 -z-10" />

        <div className="relative rounded-[20px] overflow-hidden border-[2.5px] border-white aspect-[610/450]">
          <Image src="/figma/live-shopping/video-photo.png" alt="Live video saree consultation" fill className="object-cover" />
          <Image src="/figma/live-shopping/play-button.png" alt="" width={61} height={61} className="absolute left-1/4 top-1/2 -translate-y-1/2 opacity-90" />
        </div>

        <div className="text-center md:text-left">
          <h2 className="font-display font-light text-heading-sm md:text-8xl text-ink capitalize">Shop with us live.</h2>
          <p className="mt-4 text-sm md:text-lg text-ink leading-relaxed">
            Explore sarees through a personal video shopping session. See the saree in real light, ask questions, and get help choosing from our team.
          </p>

          {/* Confirmed from Figma's own mobile + desktop pulls — fits one row without
              wrapping, with a divider between each icon. */}
          <div className="mt-8 flex justify-center md:justify-start divide-x divide-accent/30">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-2 text-center px-2 md:px-4 first:pl-0">
                <Image src={f.icon} alt="" width={30} height={30} className="md:w-[37px] md:h-[37px]" />
                <span className="text-[11px] md:text-sm text-ink leading-tight">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center md:justify-start gap-2">
            <Image src="/figma/live-shopping/icon-date.svg" alt="" width={13} height={13} />
            <span className="text-xs text-ink">Choose your preferred date &amp; time</span>
          </div>

          {bookingHref && (
            <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center h-[52px] w-[186px] rounded-sm bg-primary text-white text-xs tracking-wide2">
              Book a Session
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
