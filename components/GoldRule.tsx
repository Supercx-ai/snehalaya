export default function GoldRule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-hidden>
      <span className="h-px flex-1 bg-[#b89552]/50" />
      <span className="size-1.5 rotate-45 bg-[#b89552]" />
      <span className="h-px flex-1 bg-[#b89552]/50" />
    </div>
  );
}
