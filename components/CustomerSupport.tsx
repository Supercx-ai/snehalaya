// Each pill only renders once its env var is configured — same graceful-hide pattern as
// WhatsAppCTA, rather than showing a fake placeholder number/email.
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const SUPPORT_PHONE = process.env.NEXT_PUBLIC_SUPPORT_PHONE;
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

const btn =
  "flex-1 min-w-[9rem] h-14 rounded-lg border border-[#e6bcbc] text-ink text-sm flex items-center justify-center gap-2.5";

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 14H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
      <path d="M11 9h6a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v3l-4-3h-1a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 5.5h.01M18 5.5h.01M20.5 5.5h.01" />
      <path d="M21 16.9v2.5a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19.2 19.2 0 0 1-6-6 19.5 19.5 0 0 1-3-8.6A2 2 0 0 1 3.3 2h2.5a2 2 0 0 1 2 1.7c.1.8.3 1.6.6 2.3a2 2 0 0 1-.5 2.1L6.8 9.2a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.7.3 1.5.5 2.3.6a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z" />
      <path d="M3 7l6.5 4.5L16 7" />
      <path d="M16.5 14h4.5M18.5 11.5l2.5 2.5-2.5 2.5" />
    </svg>
  );
}

export default function CustomerSupport({ chatText }: { chatText: string }) {
  if (!WHATSAPP_NUMBER && !SUPPORT_PHONE && !SUPPORT_EMAIL) return null;

  return (
    <div className="border-t border-border-strong pt-6">
      <h3 className="text-xl font-medium text-ink mb-4">Customer Support</h3>
      <div className="flex flex-wrap gap-3">
        {WHATSAPP_NUMBER && (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(chatText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={btn}
          >
            <ChatIcon /> Chat with us
          </a>
        )}
        {SUPPORT_PHONE && (
          <a href={`tel:${SUPPORT_PHONE}`} className={btn}>
            <PhoneIcon /> {SUPPORT_PHONE}
          </a>
        )}
        {SUPPORT_EMAIL && (
          <a href={`mailto:${SUPPORT_EMAIL}`} className={btn}>
            <MailIcon /> Mail us
          </a>
        )}
      </div>
    </div>
  );
}
