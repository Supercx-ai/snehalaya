"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// SPA route changes don't trigger gtag's automatic page_view, so we fire it manually
// on every pathname/query change. Must live inside a <Suspense> boundary — useSearchParams()
// requires it in the App Router.
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    const query = searchParams.toString();
    window.gtag?.("event", "page_view", { page_path: query ? `${pathname}?${query}` : pathname });
  }, [pathname, searchParams]);

  if (!GA_ID) return null; // ponytail: hidden until NEXT_PUBLIC_GA_MEASUREMENT_ID is set

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
