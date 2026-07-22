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
    <section className="max-w-[1280px] mx-auto px-9 py-12">
      <div className="relative rounded-[25px] border border-accent overflow-hidden bg-cream shadow-[0_18px_36px_-18px_rgba(0,0,0,0.3)] px-10 py-8 grid md:grid-cols-[1fr_1fr] gap-10 items-center">
        <Image src="/figma/find/pattern-texture.png" alt="" fill className="absolute inset-0 object-cover opacity-10 -z-10" />

        <div className="relative rounded-[20px] overflow-hidden border-[2.5px] border-white aspect-[610/450]">
          <Image src="/figma/live-shopping/video-photo.png" alt="Live video saree consultation" fill className="object-cover" />
          <Image src="/figma/live-shopping/play-button.png" alt="" width={61} height={61} className="absolute left-1/4 top-1/2 -translate-y-1/2 opacity-90" />
        </div>

        <div>
          <h2 className="font-display font-light text-8xl text-ink capitalize">Shop with us live.</h2>
          <p className="mt-4 text-lg text-ink leading-relaxed">
            Explore sarees through a personal video shopping session. See the saree in real light, ask questions, and get help choosing from our team.
          </p>

          <div className="mt-8 flex gap-6">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-2 text-center w-[70px]">
                <Image src={f.icon} alt="" width={37} height={37} />
                <span className="text-sm text-ink leading-tight">{f.label}</span>
              </div>
            ))}
          </div>

          {bookingHref && (
            <a href={bookingHref} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center justify-center h-[52px] w-[186px] rounded-sm bg-primary text-white text-xs tracking-wide2">
              Book a Session
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
