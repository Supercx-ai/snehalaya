// ponytail: decorative virtual try-on promo (PDP node 2245:865). No try-on backend —
// "Try Now" is a placeholder. The model photo can't come from a screenshot; export it
// from Figma and drop it in here (an <Image> filling the framed box) to make this pixel-exact.
export default function LiveMirror() {
  return (
    <div className="mt-6 flex items-center gap-4 rounded-xl bg-[#fff4df] border border-[#f2e3c4] p-3">
      <div className="relative w-[86px] h-[86px] shrink-0 rounded-lg bg-[#e8d9c5] overflow-hidden">
        {/* viewfinder corner brackets — model photo goes behind these once exported from Figma */}
        <span className="absolute left-1.5 top-1.5 w-5 h-5 border-t-2 border-l-2 border-white rounded-tl-md" />
        <span className="absolute right-1.5 top-1.5 w-5 h-5 border-t-2 border-r-2 border-white rounded-tr-md" />
        <span className="absolute left-1.5 bottom-1.5 w-5 h-5 border-b-2 border-l-2 border-white rounded-bl-md" />
        <span className="absolute right-1.5 bottom-1.5 w-5 h-5 border-b-2 border-r-2 border-white rounded-br-md" />
      </div>

      <div className="flex-1 min-w-0">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-wide2 text-ink">
          <span className="w-2 h-2 rounded-full bg-green-500" /> LIVE MIRROR
        </span>
        <p className="mt-2 text-base text-ink">See how this saree looks on you</p>
      </div>

      <button type="button" className="shrink-0 h-12 px-8 rounded-md bg-burgundy text-white text-base font-medium">
        Try Now
      </button>
    </div>
  );
}
