// Each pill only renders once its env var is configured — same graceful-hide pattern as
// WhatsAppCTA, rather than showing a fake placeholder number/email.
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const SUPPORT_PHONE = process.env.NEXT_PUBLIC_SUPPORT_PHONE;
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

export default function CustomerSupport({ chatText }: { chatText: string }) {
  if (!WHATSAPP_NUMBER && !SUPPORT_PHONE && !SUPPORT_EMAIL) return null;

  return (
    <div className="border-t border-border-strong pt-5">
      <h3 className="text-sm font-medium text-ink mb-3">Customer Support</h3>
      <div className="flex flex-wrap gap-3">
        {WHATSAPP_NUMBER && (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(chatText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-4 rounded-sm border border-primary text-primary text-sm flex items-center"
          >
            Chat with us
          </a>
        )}
        {SUPPORT_PHONE && (
          <a href={`tel:${SUPPORT_PHONE}`} className="h-11 px-4 rounded-sm border border-primary text-primary text-sm flex items-center">
            {SUPPORT_PHONE}
          </a>
        )}
        {SUPPORT_EMAIL && (
          <a href={`mailto:${SUPPORT_EMAIL}`} className="h-11 px-4 rounded-sm border border-primary text-primary text-sm flex items-center">
            Mail us
          </a>
        )}
      </div>
    </div>
  );
}
