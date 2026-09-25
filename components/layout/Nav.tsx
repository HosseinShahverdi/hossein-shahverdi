"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { TransitionLink } from "@/components/core/TransitionLink";
import { Magnetic } from "@/components/core/Magnetic";
import { cn, EASE_OUT } from "@/lib/utils";
import type { WorldName } from "./WorldShell";

export type NavSection = { id: string; label: string };

const OTHER = {
  engineering: { href: "/research", label: "Research", dot: "#a78bfa" },
  research: { href: "/engineering", label: "Engineering", dot: "#22e3ff" },
} as const;

export default function Nav({ world, sections }: { world: WorldName; sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(v > 24);
    setHidden(v > prev && v > 520 && !open);
  });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const other = OTHER[world];

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: hidden ? -110 : 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5"
    >
      <nav
        aria-label="Primary"
        className={cn(
          "glass mx-auto flex max-w-4xl items-center justify-between gap-2 rounded-full p-1.5 transition-colors duration-500",
          scrolled ? "bg-black/55" : "bg-white/[0.03]",
        )}
      >
        <TransitionLink
          href="/"
          aria-label="Back to the index"
          data-cursor-label="Index"
          className="focus-ring flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-display text-[13px] font-extrabold text-black">
            HS
          </span>
          <span className="hidden text-[13px] text-zinc-400 sm:block">
            {world === "engineering" ? "Engineering" : "Research"}
          </span>
        </TransitionLink>

        <ul className="hidden items-center md:flex">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "focus-ring relative block rounded-full px-3.5 py-2 text-[13px] transition-colors",
                    isActive ? "text-white" : "text-zinc-400 hover:text-white",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId={`nav-pill-${world}`}
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-white/10"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <Magnetic strength={0.25}>
            <TransitionLink
              href={other.href}
              className="focus-ring group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[13px] text-white transition-colors hover:border-white/25"
            >
              <span
                className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-150"
                style={{ background: other.dot, boxShadow: `0 0 12px ${other.dot}` }}
              />
              {other.label}
            </TransitionLink>
          </Magnetic>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="focus-ring grid h-10 w-10 place-items-center rounded-full text-zinc-300 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="glass mx-auto mt-2 max-w-4xl rounded-3xl bg-black/80 p-3 md:hidden"
          >
            <ul className="grid gap-1">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "focus-ring flex items-center justify-between rounded-2xl px-4 py-3 text-base",
                      active === s.id ? "bg-white/[0.07] text-white" : "text-zinc-300",
                    )}
                  >
                    {s.label}
                    {active === s.id && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
