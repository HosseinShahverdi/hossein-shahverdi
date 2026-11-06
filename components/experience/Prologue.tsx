"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, type MotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useMedia } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { profile } from "@/lib/data";
import Robot from "./Robot";
import { useNavigator } from "./Navigator";
import { useSceneProgress } from "./useSceneProgress";

const NAME_CLASS = "font-display font-bold leading-[0.92] tracking-[0.005em] text-white text-[clamp(3.2rem,11.5vw,10.5rem)]";

/** The shared name, drawn once per half so each panel shows its own half of the same word. */
function NameLayer({ opacity, scale, blur, align }: { opacity: MotionValue<number>; scale: MotionValue<number>; blur: MotionValue<string>; align: "tl" | "br" }) {
  return (
    <motion.div
      aria-hidden
      style={{ opacity, scale, filter: blur }}
      className={cn("pointer-events-none absolute h-[100svh] w-screen", align === "tl" ? "left-0 top-0" : "bottom-0 right-0")}
    >
      <div className="container-x flex h-full flex-col items-center justify-center text-center">
        <span className={NAME_CLASS}>{profile.first}</span>
        <span className={NAME_CLASS}>{profile.last}</span>
      </div>
    </motion.div>
  );
}

/** Code-block skeleton used as the Programming half's emblem. */
function CodeEmblem() {
  const rows = [
    ["w-1/3", "w-1/4", "w-1/5"],
    ["w-1/6", "w-2/5", "w-1/5"],
    ["w-1/6", "w-1/6", "w-1/3"],
    ["w-1/5", "w-1/3", "w-1/6"],
    ["w-1/3", "w-1/5"],
    ["w-1/4", "w-1/6", "w-1/4"],
  ];
  return (
    <div aria-hidden className="w-full max-w-[19rem] rounded-2xl border border-white/10 bg-black/50 p-4 shadow-[0_20px_70px_-25px_rgb(var(--accent)/0.6)]">
      <div className="mb-3 flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
      </div>
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <div key={i} className="flex gap-2" style={{ paddingLeft: `${(i % 3) * 14}px` }}>
            {r.map((w, j) => (
              <span key={j} className={cn("h-2 rounded-full", w, (i + j) % 3 === 0 ? "bg-accent/70" : (i + j) % 3 === 1 ? "bg-accent2/45" : "bg-white/20")} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Prologue() {
  const reduce = useReducedMotion();
  return reduce ? <StaticPrologue /> : <ScrollPrologue />;
}

function ScrollPrologue() {
  const { t } = useI18n();
  const { goTo } = useNavigator();
  const desktop = useMedia("(min-width: 768px)", true);
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [hover, setHover] = useState<"r" | "p" | null>(null);
  const scrollYProgress = useSceneProgress(ref);
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.5 });
  const still = useMotionValue(0.22);
  useMotionValueEvent(scrollYProgress, "change", (v) => setArmed(v > 0.62));

  // choreography
  const nameO = useTransform(p, [0.14, 0.4], [1, 0]);
  const spread = useTransform(p, [0.1, 0.42], [0, 1]);
  const nameScale = useTransform(spread, [0, 1], [1, 1.12]);
  const nameBlur = useTransform(spread, (v) => `blur(${(v * 10).toFixed(1)}px)`);
  const tint = useTransform(p, [0.08, 0.45], [0, 1]);
  const worldO = useTransform(p, [0.4, 0.68], [0, 1]);
  const worldY = useTransform(p, [0.4, 0.68], [40, 0]);
  const introO = useTransform(p, [0, 0.12, 0.2], [1, 1, 0]);
  const seamGrow = useTransform(p, [0, 0.1], [0, 1]);
  const seamGlow = useTransform(p, [0.1, 0.5, 1], [0.5, 1, 0.7]);

  const panelBase = "absolute overflow-hidden transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:inset-y-0";
  const widthR = hover === "r" ? "57%" : hover === "p" ? "43%" : "50%";
  const widthP = hover === "p" ? "57%" : hover === "r" ? "43%" : "50%";

  return (
    <section id="top" ref={ref} data-world="home" className="relative h-[320vh] bg-[#05070a]">
      <h1 className="sr-only">{profile.name}</h1>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Research half */}
        <div
          data-world="research"
          style={desktop ? { width: widthR } : undefined}
          className={cn(panelBase, "left-0 top-0 h-1/2 w-full md:h-full")}
          onMouseEnter={() => armed && setHover("r")}
          onMouseLeave={() => setHover(null)}
        >
          <motion.div aria-hidden style={{ opacity: tint }} className="absolute inset-0 bg-base" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_50%,rgb(var(--accent)/0.28),transparent_70%)]" />
          <NameLayer opacity={nameO} scale={nameScale} blur={nameBlur} align="tl" />
          <motion.div style={{ opacity: worldO, y: worldY }} className="absolute inset-0 flex items-center justify-center px-6 md:px-10">
            <a
              href="#research"
              onClick={(e) => {
                e.preventDefault();
                goTo("research");
              }}
              tabIndex={armed ? 0 : -1}
              data-cursor-label={t.prologue.enter}
              className={cn("focus-ring group flex max-w-md flex-col items-center rounded-3xl p-4 text-center", armed ? "pointer-events-auto" : "pointer-events-none")}
            >
              <div className="relative mb-4 hidden h-[30svh] w-auto transition-transform duration-700 group-hover:scale-105 md:block">
                <Robot progress={still} label="" className="h-full w-auto" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-accent">{t.prologue.researchTag}</span>
              <span className="mt-2 hyphens-auto text-balance font-serif text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.95] text-white">{t.prologue.researchTitle}</span>
              <span className="mt-3 hidden hyphens-auto text-[15px] leading-relaxed text-zinc-400 sm:block">{t.prologue.researchText}</span>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-white transition-colors group-hover:bg-accent/25">
                {t.prologue.enter} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </motion.div>
        </div>

        {/* Programming half */}
        <div
          data-world="engineering"
          style={desktop ? { width: widthP } : undefined}
          className={cn(panelBase, "bottom-0 right-0 h-1/2 w-full md:h-full")}
          onMouseEnter={() => armed && setHover("p")}
          onMouseLeave={() => setHover(null)}
        >
          <motion.div aria-hidden style={{ opacity: tint }} className="absolute inset-0 bg-base" />
          <div aria-hidden className="grid-floor absolute inset-0 opacity-40" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_50%,rgb(var(--accent)/0.22),transparent_70%)]" />
          <NameLayer opacity={nameO} scale={nameScale} blur={nameBlur} align="br" />
          <motion.div style={{ opacity: worldO, y: worldY }} className="absolute inset-0 flex items-center justify-center px-6 md:px-10">
            <a
              href="#programming"
              onClick={(e) => {
                e.preventDefault();
                goTo("programming");
              }}
              tabIndex={armed ? 0 : -1}
              data-cursor-label={t.prologue.enter}
              className={cn("focus-ring group flex max-w-md flex-col items-center rounded-3xl p-4 text-center", armed ? "pointer-events-auto" : "pointer-events-none")}
            >
              <div className="mb-4 hidden w-full justify-center transition-transform duration-700 group-hover:scale-105 md:flex md:h-[30svh] md:items-center">
                <CodeEmblem />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">{t.prologue.progTag}</span>
              <span className="mt-2 hyphens-auto text-balance font-display text-[clamp(1.7rem,3.3vw,3rem)] font-bold leading-[1] tracking-tight text-white">{t.prologue.progTitle}</span>
              <span className="mt-3 hidden hyphens-auto text-[15px] leading-relaxed text-zinc-400 sm:block">{t.prologue.progText}</span>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm text-white transition-colors group-hover:bg-accent/25">
                {t.prologue.enter} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </motion.div>
        </div>

        {/* The seam that opens the scene */}
        <motion.div
          aria-hidden
          style={{ scaleY: desktop ? seamGrow : 1, scaleX: desktop ? 1 : seamGrow, opacity: seamGlow }}
          className="pointer-events-none absolute left-0 top-1/2 z-10 h-px w-full bg-gradient-to-r from-transparent via-white/70 to-transparent shadow-[0_0_24px_4px_rgb(255_255_255/0.25)] md:left-1/2 md:top-0 md:h-full md:w-px md:bg-gradient-to-b"
        />

        {/* Opening copy */}
        <motion.div style={{ opacity: introO }} className="pointer-events-none absolute inset-0 z-20">
          <p className="absolute inset-x-0 top-[17%] px-6 text-center text-[11px] uppercase tracking-[0.34em] text-zinc-400 sm:text-xs">{t.prologue.kicker}</p>
          <p className="absolute inset-x-0 bottom-[22%] px-6 text-center font-serif text-[clamp(1.4rem,3vw,2.4rem)] italic text-zinc-200">{t.prologue.lead}</p>
          <div className="absolute inset-x-0 bottom-[7%] flex flex-col items-center gap-3 text-[11px] uppercase tracking-[0.26em] text-zinc-500">
            {t.prologue.scroll}
            <span className="relative h-10 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-x-0 top-0 h-4 animate-[scroll-cue_1.8s_ease-in-out_infinite] bg-white/80" />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Reduced-motion variant: the name, then both worlds side by side, no pinned scene. */
function StaticPrologue() {
  const { t } = useI18n();
  const { goTo } = useNavigator();
  return (
    <section id="top" data-world="home" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#05070a] py-28">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_60%_at_15%_50%,rgb(167_139_250/0.2),transparent_70%),radial-gradient(50%_60%_at_85%_50%,rgb(34_227_255/0.16),transparent_70%)]" />
      <div className="container-x relative text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.34em] text-zinc-400">{t.prologue.kicker}</p>
        <h1 className={NAME_CLASS}>
          {profile.first}
          <br />
          {profile.last}
        </h1>
        <p className="mt-6 font-serif text-2xl italic text-zinc-200">{t.prologue.lead}</p>
        <div className="mx-auto mt-12 grid max-w-3xl gap-4 text-left sm:grid-cols-2">
          {[
            { id: "research" as const, tag: t.prologue.researchTag, title: t.prologue.researchTitle, text: t.prologue.researchText, world: "research", cls: "font-serif text-4xl" },
            { id: "programming" as const, tag: t.prologue.progTag, title: t.prologue.progTitle, text: t.prologue.progText, world: "engineering", cls: "font-display text-3xl font-bold" },
          ].map((w) => (
            <a
              key={w.id}
              data-world={w.world}
              href={`#${w.id}`}
              onClick={(e) => {
                e.preventDefault();
                goTo(w.id);
              }}
              className="focus-ring glass group rounded-3xl p-6 transition-colors hover:border-accent/50"
            >
              <span className="text-[11px] uppercase tracking-[0.28em] text-accent">{w.tag}</span>
              <span className={cn("mt-2 block text-white", w.cls)}>{w.title}</span>
              <span className="mt-2 block text-zinc-400">{w.text}</span>
              <span className="mt-4 inline-flex items-center gap-2 text-sm text-white">
                {t.prologue.enter} <ArrowRight size={15} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
