"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimate, useReducedMotion } from "framer-motion";
import { SECTIONS, WORLD_OF, type SectionId, type World } from "@/lib/sections";
import { useI18n } from "@/lib/i18n";
import { EASE_IN_OUT } from "@/lib/utils";

type Nav = { active: SectionId; world: World; goTo: (id: SectionId) => void };
const NavContext = createContext<Nav | null>(null);
export const useNavigator = () => {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNavigator must be used inside <Navigator>");
  return ctx;
};

/** Which colour tokens a world uses (see globals.css). */
export const TOKEN_OF: Record<World, string> = { home: "home", research: "research", programming: "engineering" };

/**
 * Tracks the current section while scrolling and owns navigation.
 * Jumping between worlds plays a curtain wipe in the destination's colours;
 * jumping inside a world, or with reduced motion, is a plain smooth scroll.
 */
export function Navigator({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<SectionId>("top");
  const [target, setTarget] = useState<World>("programming");
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const busy = useRef(false);
  const activeRef = useRef<SectionId>("top");

  // Scroll spy: the active section is the last one whose top has crossed 40% of the viewport.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current: SectionId = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      if (current !== activeRef.current) {
        activeRef.current = current;
        setActive(current);
        history.replaceState(null, "", current === "top" ? location.pathname : `#${current}`);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Honour a deep link such as /#programming once layout is ready.
  useEffect(() => {
    const id = location.hash.slice(1);
    if (!id || !document.getElementById(id)) return;
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "instant" as ScrollBehavior }), 120);
    return () => window.clearTimeout(timer);
  }, []);

  const goTo = useCallback(
    async (id: SectionId) => {
      const el = document.getElementById(id);
      if (!el || busy.current) return;
      const from = WORLD_OF[activeRef.current];
      const to = WORLD_OF[id];
      const crossing = from !== to && from !== "home" && to !== "home";
      const top = () => el.getBoundingClientRect().top + window.scrollY;
      if (reduce || !crossing || !scope.current) {
        window.scrollTo({ top: id === "top" ? 0 : top(), behavior: reduce ? "instant" as ScrollBehavior : "smooth" });
        return;
      }
      busy.current = true;
      setTarget(to);
      const forward = to === "programming";
      const node = scope.current;
      node.style.visibility = "visible";
      await animate(node, { clipPath: [forward ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", "inset(0 0 0 0)"] }, { duration: 0.6, ease: EASE_IN_OUT });
      window.scrollTo({ top: top(), behavior: "instant" as ScrollBehavior });
      await new Promise((r) => setTimeout(r, 180));
      await animate(node, { clipPath: ["inset(0 0 0 0)", forward ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)"] }, { duration: 0.6, ease: EASE_IN_OUT });
      node.style.visibility = "hidden";
      busy.current = false;
    },
    [animate, reduce, scope],
  );

  const value = useMemo<Nav>(() => ({ active, world: WORLD_OF[active], goTo }), [active, goTo]);
  const label = target === "research" ? t.research.title : t.programming.title;

  return (
    <NavContext.Provider value={value}>
      {children}
      <div
        ref={scope}
        aria-hidden
        data-world={TOKEN_OF[target]}
        className="pointer-events-none fixed inset-0 z-[85] bg-base"
        style={{ visibility: "hidden", clipPath: "inset(0 0 0 100%)" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgb(var(--accent)/0.22),transparent_70%)]" />
        <div className="absolute inset-0 grid place-items-center">
          <motion.p
            key={label}
            className={target === "research" ? "px-6 text-center font-serif text-[clamp(2.4rem,8vw,6rem)] text-white" : "px-6 text-center font-display text-[clamp(2rem,7vw,5rem)] font-bold text-white"}
          >
            {label}
          </motion.p>
        </div>
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
      </div>
    </NavContext.Provider>
  );
}
