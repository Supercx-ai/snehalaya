"use client";

import { useEffect, useState } from "react";

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-4" aria-hidden>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

// Wraps the PLP filter sidebar. On desktop it stays a normal sticky column; on mobile it
// collapses to a "Filters" button that opens the sidebar as a bottom-sheet, so the filters
// stop eating vertical space on small screens. The sidebar markup lives here once and is
// only repositioned by CSS, so its inputs remain inside the FilterForm and keep applying.
export default function MobileFilterToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="w-full lg:sticky lg:top-24">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden flex w-full items-center justify-center gap-2 h-11 rounded-[8px] border border-burgundy bg-white text-[13px] font-semibold tracking-[0.6px] uppercase text-burgundy"
      >
        <FilterIcon /> Filters
      </button>

      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-[89] bg-black/40 lg:hidden" />}

      <div
        className={`${
          open
            ? "fixed inset-x-0 bottom-0 top-[12%] z-[90] flex flex-col rounded-t-[16px] bg-cream shadow-[0_-8px_40px_rgba(0,0,0,0.25)]"
            : "hidden"
        } lg:static lg:z-auto lg:inset-auto lg:block lg:rounded-none lg:bg-transparent lg:shadow-none`}
      >
        <div className="lg:hidden flex items-center justify-between px-5 py-3 border-b border-[rgba(123,30,40,0.15)] shrink-0">
          <span className="text-base font-medium text-ink">Filters</span>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close filters" className="text-ink-faint text-2xl leading-none hover:text-ink">×</button>
        </div>

        {/* The sidebar has its own "Filters" heading — hide it on mobile (the sheet header
            already says Filters) but keep it on desktop. */}
        <div className="flex-1 overflow-y-auto lg:overflow-visible [&>div>h2]:hidden lg:[&>div>h2]:block">
          {children}
        </div>

        <div className="lg:hidden shrink-0 border-t border-[rgba(123,30,40,0.15)] p-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center h-11 rounded-[8px] bg-burgundy text-cream text-[13px] font-semibold tracking-[0.6px] uppercase"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
}
