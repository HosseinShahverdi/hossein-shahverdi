"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { engineeringSkills, type Tier } from "@/lib/data";
import SectionHeader from "@/components/layout/SectionHeader";
import { cn, EASE_OUT } from "@/lib/utils";

const TIER: Record<Tier, { label: string; width: string }> = {
  core: { label: "Daily driver", width: "95%" },
  strong: { label: "Production-ready", width: "72%" },
  learning: { label: "Levelling up", width: "38%" },
};

export default function Skills() {
  const groups = useMemo(() => ["All", ...Array.from(new Set(engineeringSkills.map((s) => s.group)))], []);
  const [group, setGroup] = useState("All");
  const shown = engineeringSkills.filter((s) => group === "All" || s.group === group);

  return (
    <section id="toolkit" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeader
          title="The toolkit"
          description="What I reach for to take an idea from notebook to production. Honest tiers: the bottom row is what I'm learning right now."
        />

        <div role="tablist" aria-label="Filter skills" className="mb-8 flex flex-wrap gap-1.5">
          {groups.map((g) => (
            <button
              key={g}
              role="tab"
              aria-selected={group === g}
              onClick={() => setGroup(g)}
              className={cn(
                "focus-ring relative rounded-full px-4 py-2 text-sm transition-colors",
                group === g ? "text-black" : "text-zinc-400 hover:text-white",
              )}
            >
              {group === g && (
                <motion.span
                  layoutId="skill-tab"
                  className="absolute inset-0 -z-10 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              {g}
            </button>
          ))}
        </div>

        <motion.ul layout className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {shown.map((s, i) => (
              <motion.li
                layout
                key={s.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.02, ease: EASE_OUT }}
                className="group glass rounded-2xl p-4 transition-colors duration-300 hover:border-accent/40"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-black/40 font-display text-sm font-bold text-white transition-all duration-300 group-hover:border-accent/60 group-hover:text-accent group-hover:shadow-[0_0_24px_-4px_rgb(var(--accent)/0.7)]">
                    {s.short}
                  </span>
                  <span className="text-[11px] text-zinc-500">{s.group}</span>
                </div>
                <p className="mt-4 font-medium text-white">{s.name}</p>
                <p className="text-xs text-zinc-500">{TIER[s.tier].label}</p>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className={cn("h-full rounded-full", s.tier === "learning" ? "bg-zinc-500" : "bg-gradient-to-r from-accent to-accent2")}
                    initial={{ width: 0 }}
                    whileInView={{ width: TIER[s.tier].width }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.1 + i * 0.03, ease: EASE_OUT }}
                  />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      {/* Marquee strip */}
      <div className="relative mt-20 overflow-hidden border-y border-white/[0.06] py-5 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
          {[...engineeringSkills, ...engineeringSkills].map((s, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-3xl font-bold text-white/15 sm:text-5xl">
              {s.name}
              <span className="h-2 w-2 rounded-full bg-accent/50" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
