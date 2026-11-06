"use client";

import { MotionConfig } from "framer-motion";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { IntroProvider } from "./IntroProvider";
import Loader from "./Loader";
import Cursor from "./Cursor";

function SkipLink() {
  const { t } = useI18n();
  return (
    <a href="#main" className="skip-link">
      {t.a11y.skip}
    </a>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <I18nProvider>
        <IntroProvider>
          <SkipLink />
          <Loader />
          <Cursor />
          {children}
          <div aria-hidden className="noise pointer-events-none fixed inset-0 z-[90] opacity-[0.04] mix-blend-overlay" />
        </IntroProvider>
      </I18nProvider>
    </MotionConfig>
  );
}
