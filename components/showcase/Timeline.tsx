"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import type { TimelineItem } from "@/lib/data";
import { Reveal } from "@/components/core/Reveal";
import { cn } from "@/lib/utils";

/** Alternating timeline whose spine draws itself as you scroll. */
export default function Timeline({ items, variant }: { items: TimelineItem[]; variant: "engineering" | "research" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 28 });

  return (
    <div ref={ref} className="relative">
      <div className="absolute bottom-0 left-[15px] top-0 w-px bg-white/10 md:left-1/2" />
      <motion.div
        style={{ scaleY }}
        className="absolute bottom-0 left-[15px] top-0 w-px origin-top bg-gradient-to-b from-accent via-accent2 to-accent/0 md:left-1/2"
      />
      <ol>
        {items.map((it, i) => {
          const right = i % 2 === 1;
          return (
            <li key={`${it.period}-${it.title}`} className="relative mt-8 grid pl-12 first:mt-0 md:-mt-12 md:grid-cols-2 md:pl-0 md:first:mt-0">
              <span className="absolute left-[15px] top-7 z-10 -translate-x-1/2 md:left-1/2">
                <span className="block h-3.5 w-3.5 rounded-full border-2 border-accent bg-base shadow-[0_0_18px_rgb(var(--accent)/0.7)]" />
              </span>
              <div className={cn(right ? "md:col-start-2 md:pl-14" : "md:pr-14")}>
                <Reveal y={20}>
                  <div className={cn("glass rounded-3xl p-6", !right && "md:text-right")}>
                    <p className="text-sm tabular-nums text-accent">{it.period}</p>
                    <h3
                      className={
                        variant === "engineering"
                          ? "mt-2 font-display text-xl font-bold text-white"
                          : "mt-1 font-serif text-3xl leading-tight text-white"
                      }
                    >
                      {it.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">{it.org}</p>
                    <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">{it.text}</p>
                    {it.tags && (
                      <div className={cn("mt-4 flex flex-wrap gap-1.5", !right && "md:justify-end")}>
                        {it.tags.map((t) => (
                          <span key={t} className="chip">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
