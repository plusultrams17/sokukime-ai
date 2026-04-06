"use client";

import { useState, useEffect, useCallback } from "react";
import Script from "next/script";
import { getConsentStatus, CONSENT_CHANGE_EVENT } from "@/components/cookie-consent";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const [consented, setConsented] = useState(false);

  const checkConsent = useCallback(() => {
    setConsented(getConsentStatus() === "accepted");
  }, []);

  useEffect(() => {
    checkConsent();
    window.addEventListener(CONSENT_CHANGE_EVENT, checkConsent);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, checkConsent);
  }, [checkConsent]);

  if (!GA_MEASUREMENT_ID || !consented) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function MicrosoftClarity() {
  const [consented, setConsented] = useState(false);

  const checkConsent = useCallback(() => {
    setConsented(getConsentStatus() === "accepted");
  }, []);

  useEffect(() => {
    checkConsent();
    window.addEventListener(CONSENT_CHANGE_EVENT, checkConsent);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, checkConsent);
  }, [checkConsent]);

  if (!CLARITY_PROJECT_ID || !consented) {
    return null;
  }

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}

export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}
