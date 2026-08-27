"use client";

import { useEffect, useRef, useState } from "react";

// Autoplaying reel tile. Twelve <video> elements all decoding at once would be wasteful on
// a horizontal rail where only ~4 are on screen, so playback is driven by an
// IntersectionObserver: play on enter, pause on exit. Muted + playsInline are what make
// autoplay permissible at all under browser policy.
export default function ReelTile({
  src,
  poster,
  href,
  label,
  className,
}: {
  src?: string;
  poster?: string;
  href: string;
  label: string;
  className: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Start paused and let the observer decide — otherwise offscreen tiles fetch immediately.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (data saver, low power mode) — the poster stays.
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} title={label || undefined}>
      {src ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        // Meta withholds media_url on some reels — those stay a still frame.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt={label} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      )}
    </a>
  );
}
