// ponytail: decorative virtual try-on promo. No try-on backend — "Try Now" is a placeholder.
// The model photo can't come from a screenshot; export it from Figma and drop it in here
// (e.g. an <Image> filling the framed box below) to make this pixel-exact.
export default function LiveMirror() {
  return (
    <div className="mt-6 flex items-center gap-4 rounded-2xl bg-[#fdf3e3] border border-[#efe1c6] p-3">
      <div className="relative w-[86px] h-[86px] shrink-0 rounded-xl bg-[#e8d9c5] overflow-hidden">
        {/* viewfinder corner brackets — model photo goes behind these once exported from Figma */}
        <span className="absolute left-1.5 top-1.5 w-5 h-5 border-t-2 border-l-2 border-primary/70 rounded-tl-md" />
        <span className="absolute right-1.5 top-1.5 w-5 h-5 border-t-2 border-r-2 border-primary/70 rounded-tr-md" />
        <span className="absolute left-1.5 bottom-1.5 w-5 h-5 border-b-2 border-l-2 border-primary/70 rounded-bl-md" />
        <span className="absolute right-1.5 bottom-1.5 w-5 h-5 border-b-2 border-r-2 border-primary/70 rounded-br-md" />
      </div>

      <div className="flex-1 min-w-0">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-wide2 text-ink">
          <span className="w-2 h-2 rounded-full bg-green-500" /> LIVE MIRROR
        </span>
        <p className="mt-2 text-sm text-ink">See how this saree looks on you</p>
      </div>

      <button type="button" className="shrink-0 h-12 px-7 rounded-xl bg-primary text-white text-sm font-medium">
        Try Now
      </button>
    </div>
  );
}
