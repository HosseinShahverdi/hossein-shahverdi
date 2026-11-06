export type Locale = "en" | "de";
export const LOCALES: Locale[] = ["en", "de"];
export const DEFAULT_LOCALE: Locale = "en";
export const STORAGE_KEY = "hs:lang";

export const LOCALE_META: Record<Locale, { code: string; native: string; intl: string }> = {
  en: { code: "EN", native: "English", intl: "en-GB" },
  de: { code: "DE", native: "Deutsch", intl: "de-DE" },
};

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (LOCALES as string[]).includes(v);
