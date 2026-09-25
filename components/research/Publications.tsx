"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { publications, profile, type Publication } from "@/lib/data";
import SectionHeader from "@/components/layout/SectionHeader";
import { cn, EASE_OUT } from "@/lib/utils";

const TYPES = ["All", "Journal", "Conference", "Preprint", "Abstract"] as const;

function Authors({ text }: { text: string }) {
  const me = `${profile.last}, H.`;
  const parts = text.split(me);
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <strong className="font-semibold text-white">{me}</strong>}
        </span>
      ))}
    </>
  );
}

export default function Publications() {
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const list = publications.filter((p) => type === "All" || p.type === type);

  return (
    <section id="papers" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeader
          variant="research"
          title="Publications"
          description="Journal articles, conference papers and preprints. My name is highlighted in each author list."
          aside={
            <div role="tablist" aria-label="Filter publications" className="flex flex-wrap gap-1.5">
              {TYPES.map((t) => {
                const n = t === "All" ? publications.length : publications.filter((p) => p.type === t).length;
                return (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={type === t}
                    onClick={() => setType(t)}
                    className={cn(
                      "focus-ring relative rounded-full px-4 py-2 text-sm transition-colors",
                      type === t ? "text-[#0b0826]" : "text-zinc-400 hover:text-white",
                    )}
                  >
                    {type === t && (
                      <motion.span
                        layoutId="pub-tab"
                        className="absolute inset-0 -z-10 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    {t} <span className="tabular-nums opacity-60">{n}</span>
                  </button>
                );
              })}
            </div>
          }
        />

        <motion.ol layout className="border-t border-white/10">
          <AnimatePresence initial={false} mode="popLayout">
            {list.map((p) => (
              <PubRow key={p.title} pub={p} />
            ))}
          </AnimatePresence>
        </motion.ol>
      </div>
    </section>
  );
}

function PubRow({ pub }: { pub: Publication }) {
  const Wrapper = pub.url ? "a" : "div";
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className="border-b border-white/10"
    >
      <Wrapper
        {...(pub.url ? { href: pub.url, target: "_blank", rel: "noreferrer", "data-cursor-label": "Read" } : {})}
        className="focus-ring group relative grid gap-3 px-2 py-7 transition-colors sm:grid-cols-[80px_1fr_auto] sm:gap-8 sm:px-4"
      >
        <span
          aria-hidden
          className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-accent/[0.12] to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
        <span className="font-serif text-2xl tabular-nums text-accent">{pub.year}</span>
        <div>
          <h3 className="max-w-3xl font-serif text-[1.6rem] leading-[1.2] text-white">{pub.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
            <Authors text={pub.authors} />
          </p>
          <p className="mt-1.5 text-sm italic text-zinc-300/80">{pub.venue}</p>
        </div>
        <div className="flex items-start gap-3 sm:flex-col sm:items-end">
          <span className="chip">{pub.type}</span>
          {pub.url && (
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-all duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-[#0b0826]">
              <ArrowUpRight size={18} />
            </span>
          )}
        </div>
      </Wrapper>
    </motion.li>
  );
}
