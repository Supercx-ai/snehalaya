"use client";

import { useEffect, useState } from "react";

export type LegalSection = { id: string; label: string };

// Scroll-spy index for legal pages — the Figma comp shows section 1 active
// (gold bullet + burgundy label); live we track the section nearest the top.
export default function TermsIndex({ sections }: { sections: LegalSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px" }
    );
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="flex flex-col gap-4">
      {sections.map((s) => {
        const active = s.id === activeId;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
              setActiveId(s.id);
            }}
            className="flex items-center gap-2.5"
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? "bg-accent" : "bg-[#cccccc]"}`} />
            <span className={active ? "text-sm font-semibold text-burgundy" : "text-sm text-ink-subtle"}>
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
