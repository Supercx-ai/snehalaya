import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | Snehalayaa Silks",
  description:
    "Snehalayaa Silks is born out of a profound passion for preserving India's rich handloom heritage. Curated by the elegant actress Sneha, each weave reflects authenticity, superior craftsmanship, and a commitment to keeping master artisan legacies alive.",
};

/* The Figma comp is a 1280px frame; the page renders fluid (slim gutters, fr-based
   columns) per Lohith's direction, so type must scale with the viewport to keep the
   design's internal proportions: clamp(designPx, designPx/12.8 vw, 1.5*designPx) —
   exact at 1280w, proportional up to 1920w. */

const STATS = [
  { value: "40+", label: "Years of Heritage" },
  { value: "15,000+", label: "Artisans Supported" },
  { value: "250K+", label: "Happy Customers Globally" },
  { value: "45+", label: "Traditional Weaves Saved" },
] as const;

const VALUES = [
  {
    icon: "hands",
    title: "Our Mission",
    body: "To empower traditional Indian handloom communities by providing fair wages, sustainable demand, and digital access, while guaranteeing patrons across the globe the absolute zenith of authentic silk artistry.",
  },
  {
    icon: "eye",
    title: "Our Vision",
    body: "To become the premier global standard of Indian luxury ethnic wear, celebrated not just for aesthetic majesty, but for ethical preservation and deep-rooted respect for the hands that weave every thread.",
  },
  {
    icon: "leaf",
    title: "Eco-Conscious Legacy",
    body: "We are actively adopting natural vegetable dyes, water-saving hand-wash techniques, and organic yarn clusters to ensure the sarees we craft leave a positive legacy for both the earth and our communities.",
  },
] as const;

const ARTISANS = [
  {
    image: "/figma/about/artisan-weaver.jpg",
    name: "Ramanathan Swamy",
    role: "Master Weaver, Kanchipuram",
    body: "Wielding the shuttle for over 45 years, Ramanathan specializes in double-warp pure zari borders, taking up to 18 days to weave a single masterwork.",
  },
  {
    image: "/figma/about/artisan-zari.jpg",
    name: "Saraswathi Devi",
    role: "Zari Designer, Varanasi",
    body: "Devi meticulously drafts traditional 'naksha' designs on cards, transforming ancient folklore into gold motifs woven gracefully on Banarasi silk.",
  },
] as const;

const PROMISES = [
  {
    icon: "seal",
    title: "Silk Mark Certified",
    body: "100% natural, pure mulberry silk verified by the Silk Mark Organisation of India.",
  },
  {
    icon: "star",
    title: "Authentic Zari",
    body: "Crafted exclusively using genuine silver zari plated with pure 24-karat gold.",
  },
  {
    icon: "heart",
    title: "Ethical Procurement",
    body: "Direct payment systems that cut out middle-men, ensuring artisans receive up to 85% of saree value.",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "The weight, the drape, the deep gold zari was exactly as shown during actress Sneha's campaign presentation. It felt so regal for my daughter's wedding.",
    name: "Srinidhi Iyer",
    city: "Chennai",
  },
  {
    quote:
      "Incredibly beautiful fabric. The hand-woven Chanderi feels like second skin. Truly worth the premium price for authentic Indian art.",
    name: "Rekha Sharma",
    city: "Mumbai",
  },
  {
    quote:
      "The live video shopping experience made purchasing from London stress-free. They held up multiple shades of Plum in natural daylight.",
    name: "Dr. Kavitha Naidu",
    city: "London",
  },
] as const;

// design 40px H2 on cream sections
const SECTION_H2 = "font-display font-light text-heading-sm md:text-[clamp(40px,3.125vw,60px)] leading-[1.2] text-burgundy";
// design 15-16px body copy
const BODY_MD = "text-[clamp(14px,1.17vw,22px)] leading-[1.6] text-ink-subtle";
const BODY_SM = "text-[clamp(13px,1.02vw,20px)] leading-[1.6] text-ink-subtle";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[clamp(12px,0.94vw,18px)] font-semibold uppercase tracking-[clamp(2.5px,0.23vw,4.5px)] text-accent">
      {children}
    </p>
  );
}

function ValueIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    hands: (
      <>
        <path d="M12 8.2c1.5-2.6 5.4-1.7 5.4 1 0 2-2.7 4-5.4 5.9-2.7-1.9-5.4-3.9-5.4-5.9 0-2.7 3.9-3.6 5.4-1Z" />
        <path d="M3.5 12.5v5.4M20.5 12.5v5.4M3.5 16h4.2l2.5 1.7h3.6M20.5 16h-4.2" strokeLinecap="round" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
        <circle cx="12" cy="12" r="2.8" />
      </>
    ),
    leaf: (
      <>
        <path d="M6 18C6 9.5 12.5 5.5 19 5c.5 6.5-2 13-11 13H6Z" />
        <path d="M5 19.5c2.5-5 6-8 10-10" strokeLinecap="round" />
      </>
    ),
    seal: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.6 12 2.3 2.3 4.5-4.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    star: (
      <path d="m12 4 2.3 4.9 5.2.7-3.8 3.7.9 5.3-4.6-2.6-4.6 2.6.9-5.3-3.8-3.7 5.2-.7L12 4Z" strokeLinejoin="round" />
    ),
    heart: (
      <path d="M12 19.5c-4.5-3-8-6-8-9.5a4.4 4.4 0 0 1 8-2.4A4.4 4.4 0 0 1 20 10c0 3.5-3.5 6.5-8 9.5Z" strokeLinejoin="round" />
    ),
  };
  return (
    <span className="w-[clamp(44px,3.44vw,66px)] h-[clamp(44px,3.44vw,66px)] shrink-0 rounded-full bg-[#f7efdf] flex items-center justify-center text-accent">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-[clamp(20px,1.56vw,30px)] h-[clamp(20px,1.56vw,30px)]">
        {paths[name]}
      </svg>
    </span>
  );
}

function Stars() {
  return (
    <div className="flex gap-1 text-accent" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-[clamp(16px,1.25vw,24px)] h-[clamp(16px,1.25vw,24px)]">
          <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5Z" />
        </svg>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-cream">
      {/* Legacy hero — the play button and burgundy scrim are baked into the banner
          capture; the design has no video URL behind it. */}
      <section className="px-4 md:px-10 py-12 md:py-[clamp(64px,5vw,96px)] text-center">
        <div>
          <Eyebrow>Our Legacy &amp; Spirit</Eyebrow>
          <h1 className="mt-6 font-display font-light text-heading-sm md:text-[clamp(55px,4.3vw,83px)] leading-[1.1] text-burgundy">
            Weaving Threads of Culture, Elegance &amp; Timeless Grace
          </h1>
          <p className={`mt-6 mx-auto max-w-[1000px] md:max-w-[83%] text-[clamp(15px,1.25vw,24px)] leading-[1.6] text-ink-subtle`}>
            Snehalayaa Silks is born out of a profound passion for preserving India&rsquo;s rich handloom heritage.
            Curated by the elegant actress Sneha, each weave reflects authenticity, superior craftsmanship, and a
            commitment to keeping master artisan legacies alive.
          </p>
          <div className="relative mt-10 aspect-[1200/494] rounded-[16px] overflow-hidden">
            <Image src="/figma/about/hero-video.jpg" alt="Inside a Snehalayaa Silks sanctuary" fill priority className="object-cover" />
          </div>
        </div>
      </section>

      {/* Founder message */}
      <section className="px-4 md:px-5">
        <div className="bg-white rounded-[20px] p-2.5 grid grid-cols-1 md:grid-cols-[448fr_762fr] gap-6 md:gap-10">
          <div className="relative aspect-[448/505] rounded-[14px] overflow-hidden">
            <Image src="/figma/about/founder.jpg" alt="Actress Sneha, founder of Snehalayaa Silks" fill className="object-cover" />
          </div>
          <div className="px-4 pb-8 md:py-10 md:pr-12 md:self-center">
            <h2 className="font-display font-light text-[44px] md:text-[clamp(88px,6.9vw,132px)] leading-[1.2] text-ink">
              Founder Message
            </h2>
            <p className="mt-3 font-display font-light text-[24px] md:text-[clamp(34px,2.66vw,51px)] leading-[1.2] text-burgundy">
              Wrap Yourself In Timeless Elegance With Us
            </p>
            <div className="mt-10 space-y-4 text-[clamp(13px,1.05vw,20px)] leading-[1.5] text-ink-subtle">
              <p>
                Snehalayaa represents more than just sarees; it celebrates the art of crafting one&rsquo;s personality.
                At Snehalayaa Silks, we understand this art like no one else.
              </p>
              <p>
                Our commitment to customer satisfaction ensures we deliver sarees of exceptional quality, beauty, and
                luxury. Each piece showcases the impeccable craftsmanship of our weavers, bringing each saree to life.
              </p>
              <p>
                Our commitment to customer satisfaction ensures we deliver sarees of exceptional quality, beauty, and
                luxury. Each piece showcases the impeccable craftsmanship of our weavers, bringing each saree to life.{" "}
                <span className="font-semibold text-ink">Read More</span>
              </p>
            </div>
            <Image
              src="/figma/ambassador/signature.png"
              alt="Sneha"
              width={130}
              height={63}
              className="mt-8 mix-blend-multiply w-[clamp(130px,10.4vw,195px)] h-auto"
            />
            <p className="mt-2 text-[clamp(14px,1.17vw,22px)] text-burgundy">Founder of Snehalayaa Silks - Actress Sneha.</p>
          </div>
        </div>
      </section>

      {/* The beginning */}
      <section className="mt-24 bg-[#fff8ea] px-4 md:px-10 py-14 md:py-[clamp(80px,6.25vw,120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[656fr_480fr] gap-10 lg:gap-[clamp(48px,5vw,96px)] items-center">
          <div>
            <Eyebrow>The Beginning</Eyebrow>
            <h2 className={`mt-4 ${SECTION_H2}`}>
              A Heritage Born From the Heart of Weaving Looms
            </h2>
            <div className={`mt-6 space-y-5 ${BODY_MD}`}>
              <p>
                For centuries, the Indian saree has been more than a garment; it is a canvas of cultural history,
                values, and community artistry. Snehalayaa Silks was established with the vision of bridging authentic
                weaver clusters directly to saree connoisseurs worldwide.
              </p>
              <p>
                From sourcing the purest Mulberry silks to insisting on genuine silver and gold zari threads, we honor
                traditional patterns of Kanchipuram, Banaras, Paithan, and Chanderi. By choosing Snehalayaa, you partake
                in a lineage of craftsmanship that stays alive across generations.
              </p>
            </div>
            <div className="mt-8 bg-cream border border-accent/70 p-[clamp(20px,1.875vw,36px)]">
              <p className="font-display italic text-[clamp(18px,1.56vw,30px)] leading-[1.4] text-burgundy">
                &ldquo;We do not replicate fashion. We revive heritage.&rdquo;
              </p>
              <p className="mt-3 text-[clamp(11px,0.94vw,18px)] font-semibold uppercase tracking-[1px] text-ink">
                Our Weaving Standard
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-[clamp(20px,1.875vw,36px)]">
            <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
              <Image src="/figma/about/loom.jpg" alt="Hands weaving zari on a traditional loom" fill className="object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-[clamp(12px,1.25vw,24px)]">
              <div className="relative aspect-[232/200] rounded-lg overflow-hidden">
                <Image src="/figma/about/dyeing.jpg" alt="Silk yarn dyed in natural pigments" fill className="object-cover" />
              </div>
              <div className="relative aspect-[232/200] rounded-lg overflow-hidden">
                <Image src="/figma/about/bride.jpg" alt="Bride draped in a Kanjivaram saree" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-burgundy px-4 md:px-10 py-10 md:py-[clamp(56px,4.375vw,84px)]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display font-light text-[40px] md:text-[clamp(56px,4.375vw,84px)] leading-[1.2] text-accent">
                {s.value}
              </p>
              <p className="mt-3 text-[clamp(12px,1.02vw,19px)] font-semibold uppercase tracking-[1px] text-cream">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / vision / eco */}
      <section className="px-4 md:px-10 py-14 md:py-[clamp(80px,6.25vw,120px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-[clamp(32px,3.75vw,72px)]">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-white rounded-[12px] border border-border-subtle p-[clamp(24px,2.5vw,48px)]">
              <ValueIcon name={v.icon} />
              <h2 className="mt-6 font-display text-[clamp(24px,2.03vw,39px)] leading-[1.2] text-burgundy">{v.title}</h2>
              <p className={`mt-4 ${BODY_SM} leading-[1.7]`}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Artistry divider */}
      <div className="px-4 md:px-10 pb-8 flex items-center gap-6">
        <span className="flex-1 h-px bg-accent/50" />
        <p className="font-display italic text-[clamp(20px,1.56vw,30px)] text-accent">Artistry Spotlights</p>
        <span className="flex-1 h-px bg-accent/50" />
      </div>

      {/* Master artisans */}
      <section className="bg-[#fff8ea] px-4 md:px-10 py-14 md:py-[clamp(80px,6.25vw,120px)]">
        <div className="text-center">
          <Eyebrow>The Hands Behind the Loom</Eyebrow>
          <h2 className={`mt-4 ${SECTION_H2}`}>Meet Our Master Artisans</h2>
          <p className={`mt-4 mx-auto max-w-[520px] md:max-w-[43%] ${BODY_MD}`}>
            Every Snehalayaa saree is an epic poem of human endurance, skill, and creative wisdom.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-[clamp(32px,3.75vw,72px)] text-left">
            {ARTISANS.map((a) => (
              <div key={a.name} className="bg-white rounded-[12px] p-[clamp(20px,1.875vw,36px)] grid grid-cols-1 sm:grid-cols-[150fr_378fr] gap-6 items-center">
                <div className="relative w-full aspect-[150/196] rounded-lg overflow-hidden">
                  <Image src={a.image} alt={a.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-display text-[clamp(22px,1.875vw,36px)] leading-[1.2] text-burgundy">{a.name}</h3>
                  <p className="mt-2 text-[clamp(11px,0.94vw,18px)] font-semibold uppercase tracking-[1.5px] text-accent">
                    {a.role}
                  </p>
                  <p className={`mt-3 ${BODY_SM}`}>{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Snehalayaa promise */}
      <section className="bg-white px-4 md:px-10 py-14 md:py-[clamp(80px,6.25vw,120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[392fr_760fr] gap-10 lg:gap-[clamp(32px,3.75vw,72px)] items-center">
          <div className="relative aspect-square rounded-[16px] overflow-hidden">
            <Image src="/figma/about/authenticity.jpg" alt="Magnifying glass over pure zari brocade" fill className="object-cover" />
          </div>
          <div>
            <Eyebrow>The Snehalayaa Promise</Eyebrow>
            <h2 className={`mt-3 ${SECTION_H2}`}>Uncompromised Purity &amp; Integrity</h2>
            <ul className="mt-8 space-y-[clamp(24px,1.875vw,36px)]">
              {PROMISES.map((p) => (
                <li key={p.title} className="flex gap-4 items-start">
                  <ValueIcon name={p.icon} />
                  <div>
                    <h3 className="text-[clamp(15px,1.25vw,24px)] font-semibold text-ink">{p.title}</h3>
                    <p className={`mt-1 ${BODY_SM}`}>{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#fff8ea] px-4 md:px-10 py-14 md:py-[clamp(80px,6.25vw,120px)]">
        <div className="text-center">
          <Eyebrow>Loved by You</Eyebrow>
          <h2 className={`mt-4 ${SECTION_H2}`}>Stories of Celebration</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-[clamp(32px,3.75vw,72px)] text-left">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-[12px] p-[clamp(24px,2.2vw,42px)]">
                <Stars />
                <p className="mt-5 font-display italic text-[clamp(16px,1.41vw,27px)] leading-[1.55] text-ink">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-5 text-[clamp(13px,1.09vw,21px)]">
                  <span className="font-semibold text-burgundy">{t.name}</span>
                  <span className="text-ink-subtle"> &middot; {t.city}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
