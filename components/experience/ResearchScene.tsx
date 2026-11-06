"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { EASE_OUT, cn } from "@/lib/utils";
import StatusBadge from "@/components/showcase/StatusBadge";
import Robot, { STAGE_COLORS } from "./Robot";
import NeuralField from "./NeuralField";
import { useSceneProgress } from "./useSceneProgress";

const STAGES = 5;
const CHIP_SPOTS = [
  "left-[4%] top-[24%]",
  "right-[5%] top-[30%]",
  "left-[10%] bottom-[22%]",
] as const;

/** Research & AI: the robot stands inside a neural network and its attention moves through five stages as you scroll. */
export default function ResearchScene() {
  const { t, content } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const [intro, setIntro] = useState(true);
  const scrollYProgress = useSceneProgress(ref);
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.6 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIntro(v < 0.1);
    setStage(Math.min(STAGES - 1, Math.max(0, Math.floor(v * STAGES))));
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.07, 0.14], [1, 0.9, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.14], [0, -90]);
  const robotScale = useTransform(scrollYProgress, [0, 0.12], [0.86, 1]);
  const robotOpacity = useTransform(scrollYProgress, [0.02, 0.14], [0, 1]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  const jumpToStage = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + travel * ((i + 0.5) / STAGES), behavior: "smooth" });
  };

  const s = t.research.stages[stage];
  const questions = content.experiments;

  if (reduce) return <StaticResearch />;

  return (
    <section id="research" ref={ref} data-world="research" aria-labelledby="research-title" className="relative h-[540vh] bg-base">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div aria-hidden style={{ y: glowY }} className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_45%,rgb(var(--accent)/0.20),transparent_70%)]" />
        <div aria-hidden className="grid-floor absolute inset-x-0 bottom-0 h-1/2 opacity-40" />
        <NeuralField progress={smooth} />

        {/* Opening title sits behind the robot and lifts away */}
        <motion.div style={{ opacity: titleOpacity, y: titleY }} className="pointer-events-none absolute inset-x-0 top-[17%] z-0 px-6 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.32em] text-accent">{t.research.kicker}</p>
          <h2 id="research-title" className="font-serif text-[clamp(3.6rem,13vw,11rem)] leading-[0.9] text-white">
            {t.research.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] text-zinc-400 sm:text-lg">{t.research.intro}</p>
        </motion.div>

        {/* Robot */}
        <motion.div
          style={{ scale: robotScale, opacity: robotOpacity }}
          className="absolute inset-x-0 bottom-[50%] top-[11%] z-10 flex justify-center lg:inset-y-[11%] lg:left-[22%] lg:right-[22%]"
        >
          <Robot progress={smooth} label="" className="h-full w-auto max-w-full" />
        </motion.div>

        {/* Stage content */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="container-x relative h-full">
            <div className="absolute inset-x-5 bottom-[13%] sm:inset-x-8 lg:bottom-auto lg:left-12 lg:right-auto lg:top-1/2 lg:w-[min(25rem,34vw)] lg:-translate-y-1/2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                  animate={{ opacity: stage === 0 && intro ? 0 : 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="rounded-3xl border border-white/10 bg-base/80 p-5 backdrop-blur-md sm:p-6"
                >
                  <p className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-accent">
                    <span className="tabular-nums">{String(stage + 1).padStart(2, "0")}</span>
                    <span className="h-px w-8 bg-accent/60" />
                    <span>{t.research.stage}</span>
                  </p>
                  <h3 className="hyphens-auto font-serif text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[1] text-white">{s.title}</h3>
                  <p className="mt-3 hyphens-auto text-[15px] leading-relaxed text-zinc-300 sm:text-[16px]">{s.text}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5 lg:hidden">
                    {s.chips.map((c) => (
                      <span key={c} className="chip">
                        {c}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating concept labels */}
            <AnimatePresence mode="wait">
              <motion.div key={`chips-${stage}`} className="absolute inset-0 hidden lg:block" initial={{ opacity: 0 }} animate={{ opacity: stage === 0 && intro ? 0 : 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
                {s.chips.map((c, i) => (
                  <span
                    key={c}
                    style={{ animationDelay: `${i * -2.1}s`, borderColor: `${STAGE_COLORS[stage]}66` }}
                    className={cn("chip absolute animate-float-y bg-black/50 px-3.5 py-1.5 text-[13px] text-white backdrop-blur", CHIP_SPOTS[i % 3], i === 1 && "md:right-[4%] lg:right-[7%]")}
                  >
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full" style={{ background: STAGE_COLORS[stage] }} />
                    {c}
                  </span>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Open questions appear with the last stage */}
            <AnimatePresence>
              {stage === STAGES - 1 && (
                <motion.aside
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                  className="pointer-events-auto absolute right-8 top-1/2 hidden w-[min(22rem,28vw)] -translate-y-1/2 xl:block"
                >
                  <p className="mb-3 text-xs uppercase tracking-[0.24em] text-accent">{t.research.questionsTitle}</p>
                  <ul className="space-y-2.5">
                    {questions.map((q) => (
                      <li key={q.id} className="rounded-2xl border border-white/10 bg-black/45 p-3.5 backdrop-blur">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-serif text-xl text-white">{q.name}</span>
                          <StatusBadge status={q.status} />
                        </div>
                        <p className="mt-1 hyphens-auto text-[13px] leading-snug text-zinc-400">{q.question}</p>
                      </li>
                    ))}
                  </ul>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stage rail */}
        <div className="absolute inset-x-0 bottom-5 z-30 flex justify-center px-4">
          <ol className="flex items-center gap-1 rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-md">
            {t.research.stages.map((st, i) => (
              <li key={st.key}>
                <button
                  type="button"
                  onClick={() => jumpToStage(i)}
                  aria-current={i === stage ? "step" : undefined}
                  aria-label={st.title}
                  className={cn("focus-ring rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors", i === stage ? "bg-accent/20 text-white" : "text-zinc-500 hover:text-white")}
                >
                  {st.key}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <motion.p style={{ opacity: titleOpacity }} className="absolute bottom-[4.5rem] left-1/2 z-30 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.26em] text-zinc-500">
          {t.research.scrollCue}
        </motion.p>
      </div>

      {/* Full copy for assistive tech and crawlers, regardless of scroll position */}
      <ul className="sr-only">
        {t.research.stages.map((st) => (
          <li key={st.key}>
            {st.title}. {st.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Reduced-motion variant: no pinning, no scroll choreography, all five stages readable as plain content. */
function StaticResearch() {
  const { t } = useI18n();
  const still = useMotionValue(0.5);
  return (
    <section id="research" data-world="research" aria-labelledby="research-title" className="relative overflow-hidden bg-base py-28">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_20%,rgb(var(--accent)/0.2),transparent_70%)]" />
      <div className="container-x relative">
        <p className="mb-3 text-xs uppercase tracking-[0.32em] text-accent">{t.research.kicker}</p>
        <h2 id="research-title" className="font-serif text-[clamp(3rem,10vw,8rem)] leading-[0.92] text-white">
          {t.research.title}
        </h2>
        <p className="mt-5 max-w-xl text-lg text-zinc-400">{t.research.intro}</p>
        <div className="mx-auto my-12 h-[22rem] max-w-xs">
          <Robot progress={still} label="" className="h-full w-full" />
        </div>
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.research.stages.map((st, i) => (
            <li key={st.key} className="glass rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-serif text-3xl text-white">{st.title}</h3>
              <p className="mt-2 text-zinc-400">{st.text}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {st.chips.map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
