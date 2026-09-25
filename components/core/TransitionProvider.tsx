"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { animate, motion, useReducedMotion } from "framer-motion";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/utils";

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionContext);

type Meta = { label: string; caption: string; bg: string; accent: string; serif?: boolean };
const META: Record<string, Meta> = {
  "/": { label: "Hossein Shahverdi", caption: "Choose a world", bg: "#040608", accent: "#e4e4e7" },
  "/engineering": { label: "Engineering", caption: "Build, secure, ship", bg: "#03090c", accent: "#22e3ff" },
  "/research": { label: "Research", caption: "AI and academic work", bg: "#0b0826", accent: "#a78bfa", serif: true },
};

const HIDDEN = "inset(100% 0% 0% 0%)";
const COVER = "inset(0% 0% 0% 0%)";
const LIFTED = "inset(0% 0% 100% 0%)";

/**
 * World-to-world transition: a full-screen curtain rises, the route changes
 * underneath it, then the curtain lifts off the top. Works around the App
 * Router's lack of exit animations.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const curtain = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pending = useRef<string | null>(null);
  const [meta, setMeta] = useState<Meta>(META["/"]);
  const [active, setActive] = useState(false);

  const reveal = useCallback(async () => {
    const el = curtain.current;
    if (!el) return;
    await animate(el, { clipPath: LIFTED }, { duration: 0.85, ease: EASE_IN_OUT, delay: 0.2 });
    el.style.clipPath = HIDDEN;
    setActive(false);
    busy.current = false;
  }, []);

  const navigate = useCallback(
    async (href: string) => {
      const path = href.split("#")[0] || "/";
      if (busy.current) return;
      if (path === pathname) {
        const hash = href.split("#")[1];
        if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        return;
      }
      if (reduce || !curtain.current) {
        router.push(href);
        return;
      }
      busy.current = true;
      pending.current = path;
      setMeta(META[path] ?? META["/"]);
      setActive(true);
      router.prefetch(path);
      await animate(curtain.current, { clipPath: [HIDDEN, COVER] }, { duration: 0.75, ease: EASE_IN_OUT });
      router.push(href);
      // Safety net if navigation is slow or fails
      window.setTimeout(() => {
        if (pending.current) {
          pending.current = null;
          void reveal();
        }
      }, 3000);
    },
    [pathname, reduce, router, reveal],
  );

  useEffect(() => {
    if (pending.current && pathname === pending.current) {
      pending.current = null;
      void reveal();
    }
  }, [pathname, reveal]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[95] flex items-center justify-center overflow-hidden"
        style={{ clipPath: HIDDEN, background: meta.bg }}
      >
        {active && (
          <div className="relative text-center">
            <motion.div
              className="absolute left-1/2 top-1/2 -z-10 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: meta.accent, opacity: 0.12 }}
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: EASE_OUT }}
            />
            <div className="overflow-hidden pb-2">
              <motion.p
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE_OUT }}
                className={
                  meta.serif
                    ? "font-serif text-7xl italic text-white sm:text-9xl"
                    : "font-display text-6xl font-extrabold tracking-tight text-white sm:text-8xl"
                }
              >
                {meta.label}
              </motion.p>
            </div>
            <motion.div
              className="mx-auto mt-5 h-px w-48 origin-left"
              style={{ background: meta.accent }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.35, duration: 0.9, ease: EASE_IN_OUT }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-4 text-sm text-zinc-400"
            >
              {meta.caption}
            </motion.p>
          </div>
        )}
      </div>
    </TransitionContext.Provider>
  );
}
