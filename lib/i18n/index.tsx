"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, STORAGE_KEY, isLocale, type Locale } from "./config";
import { de, en, type Dict } from "./dict";
import { getContent } from "./content";

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: Dict; content: ReturnType<typeof getContent> };
const I18nContext = createContext<Ctx | null>(null);
const DICTS: Record<Locale, Dict> = { en, de };

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Restore the saved language after hydration so server and client markup match.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isLocale(saved)) setLocaleState(saved);
      else if (navigator.language?.toLowerCase().startsWith("de")) setLocaleState("de");
    } catch {
      /* storage unavailable: stay on the default */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = DICTS[locale].meta.title;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(() => ({ locale, setLocale, t: DICTS[locale], content: getContent(locale) }), [locale, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
