"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { RAIL } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { TOKEN_OF, useNavigator } from "./Navigator";

/** Persistent minimal nav: logo, a two-world switch that follows scroll, and the language toggle. */
export default function SiteNav() {
  const { t, locale, setLocale } = useI18n();
  const { world, goTo } = useNavigator();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const worlds = [
    { id: "research" as const, key: "research" as const, long: t.nav.research, short: t.nav.researchShort },
    { id: "programming" as const, key: "programming" as const, long: t.nav.programming, short: t.nav.programmingShort },
  ];

  return (
    <>
      <header data-world={TOKEN_OF[world]} className="fixed inset-x-0 top-0 z-50">
        <motion.div
          aria-hidden
          style={{ scaleX: progress }}
          className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-accent to-accent2"
        />
        <div className="container-x flex h-16 items-center justify-between gap-3 sm:h-[72px]">
          <button
            type="button"
            onClick={() => goTo("top")}
            aria-label={t.a11y.home}
            data-cursor-label="Top"
            className="focus-ring group flex items-center gap-2.5 rounded-full py-1 pr-2"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/40 font-display text-[13px] font-bold text-white backdrop-blur transition-colors group-hover:border-accent/60">
              HS
            </span>
            <span className="hidden font-display text-[15px] font-semibold text-white md:block">Hossein Shahverdi</span>
          </button>

          <nav aria-label={t.a11y.worldSwitch} className="relative flex rounded-full border border-white/10 bg-black/45 p-1 backdrop-blur-md">
            {worlds.map((w) => {
              const on = world === w.key;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => goTo(w.id)}
                  aria-current={on ? "true" : undefined}
                  className="focus-ring relative rounded-full px-3.5 py-2 text-[13px] font-medium sm:px-5"
                >
                  {on && (
                    <motion.span
                      layoutId="world-pill"
                      className="absolute inset-0 rounded-full border border-accent/40 bg-accent/15"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className={cn("relative whitespace-nowrap transition-colors", on ? "text-white" : "text-zinc-400 hover:text-white")}>
                    <span className="sm:hidden">{w.short}</span>
                    <span className="hidden sm:inline">{w.long}</span>
                  </span>
                </button>
              );
            })}
          </nav>

          <div role="group" aria-label={t.a11y.langSwitch} className="flex rounded-full border border-white/10 bg-black/45 p-1 backdrop-blur-md">
            {LOCALES.map((l) => (
              <button
                key={l}
                type="button"
                lang={l}
                onClick={() => setLocale(l)}
                aria-pressed={locale === l}
                title={LOCALE_META[l].native}
                className={cn(
                  "focus-ring rounded-full px-2.5 py-2 text-[12px] font-semibold tracking-wide transition-colors",
                  locale === l ? "bg-white text-black" : "text-zinc-400 hover:text-white",
                )}
              >
                {LOCALE_META[l].code}
              </button>
            ))}
          </div>
        </div>
      </header>
      <Rail />
    </>
  );
}

/** Right-edge section indicator for the current world. Hidden on small screens, where the top line suffices. */
function Rail() {
  const { t } = useI18n();
  const { active, world, goTo } = useNavigator();
  const ids = RAIL[world];
  return (
    <nav
      aria-label={t.a11y.progress}
      data-world={TOKEN_OF[world]}
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {ids.map((id) => {
        const on = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => goTo(id)}
            aria-current={on ? "true" : undefined}
            className="focus-ring group flex items-center gap-3 rounded-full py-0.5"
          >
            <span
              className={cn(
                "text-[11px] uppercase tracking-[0.16em] transition-all duration-300",
                on ? "translate-x-0 text-white opacity-100" : "translate-x-1 text-zinc-500 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
              )}
            >
              {t.sections[id]}
            </span>
            <span
              className={cn(
                "block rounded-full transition-all duration-300",
                on ? "h-6 w-1.5 bg-accent shadow-[0_0_14px_rgb(var(--accent)/0.8)]" : "h-1.5 w-1.5 bg-white/25 group-hover:bg-white/60",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
