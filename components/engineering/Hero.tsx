"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { engineeringIntro, engineeringStats, profile } from "@/lib/data";
import { useIntro } from "@/components/core/IntroProvider";
import { Magnetic } from "@/components/core/Magnetic";
import { TransitionLink } from "@/components/core/TransitionLink";
import { EASE_OUT } from "@/lib/utils";
import Terminal from "./Terminal";

const rise = {
  hidden: { y: "110%" },
  show: (d: number) => ({
    y: "0%",
    transition: { delay: d, duration: 1, ease: EASE_OUT },
  }),
};
const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.9, ease: EASE_OUT },
  }),
};

export default function EngineeringHero() {
  const { ready } = useIntro();
  const state = ready ? "show" : "hidden";

  return (
    <section
      id="intro"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pb-10 pt-32 sm:pt-36"
    >
      {/* Backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0" />
        <div className="grid-floor" />
        <div className="absolute left-1/2 top-[-20%] h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-accent/[0.09] blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] h-[40vh] w-[40vw] rounded-full bg-accent2/[0.07] blur-[120px]" />
        <span className="beam left-[18%]" />
        <span className="beam left-[62%]" style={{ animationDelay: "2.6s" }} />
        <span className="beam left-[86%]" style={{ animationDelay: "4.8s" }} />
      </div>

      <div className="container-x flex-1">
        <motion.div
          variants={fade}
          initial="hidden"
          animate={state}
          custom={0.1}
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/25 bg-emerald-400/[0.08] px-3.5 py-1.5 text-[13px] text-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for opportunities
          </span>
        </motion.div>

        <h1 className="mt-7 font-display text-[clamp(2.25rem,8.6vw,8.75rem)] font-bold leading-[0.9] tracking-[0.005em] text-white">
          {" "}
          <span className="sr-only">{profile.name}</span>
          <span aria-hidden className="block overflow-hidden pb-[0.04em]">
            <motion.span
              className="block"
              variants={rise}
              initial="hidden"
              animate={state}
              custom={0.15}
            >
              {profile.first}
            </motion.span>
          </span>
          <span aria-hidden className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block"
              variants={rise}
              initial="hidden"
              animate={state}
              custom={0.28}
            >
              <span className="scan-name text-outline" data-text={profile.last}>
                {profile.last}
              </span>
            </motion.span>
          </span>
        </h1>

        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[1fr_1.05fr]">
          <div className="min-w-0">
            <motion.div
              variants={fade}
              initial="hidden"
              animate={state}
              custom={0.5}
            >
              <RoleRotator />
            </motion.div>

            <motion.p
              variants={fade}
              initial="hidden"
              animate={state}
              custom={0.6}
              className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-400"
            >
              {engineeringIntro}
            </motion.p>

            <motion.div
              variants={fade}
              initial="hidden"
              animate={state}
              custom={0.7}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <a
                  href="#projects"
                  className="focus-ring group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3.5 text-[15px] font-semibold text-black shadow-[0_0_40px_-8px_rgb(var(--accent)/0.8)]"
                >
                  <span className="relative z-10">See the work</span>
                  <ArrowDown
                    size={16}
                    className="relative z-10 transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                  <span className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-700 group-hover:translate-x-full" />
                </a>
              </Magnetic>
              <Magnetic>
                <TransitionLink
                  href="/research"
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-[15px] text-white transition-colors hover:border-[#a78bfa]/60 hover:bg-[#a78bfa]/10"
                >
                  Enter the research world
                </TransitionLink>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            className="min-w-0"
            initial={{ opacity: 0, y: 40, rotateX: 12 }}
            animate={ready ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
            transition={{ delay: 0.55, duration: 1.1, ease: EASE_OUT }}
            style={{ transformPerspective: 1200 }}
          >
            <Terminal start={ready} />
          </motion.div>
        </div>
      </div>

      <motion.dl
        variants={fade}
        initial="hidden"
        animate={state}
        custom={0.9}
        className="container-x mt-16 grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4"
      >
        {engineeringStats.map((s) => (
          <div key={s.label} className="border-t border-white/10 py-5 pr-4">
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-3xl font-bold text-white sm:text-4xl">
              {s.value}
            </dd>
            <dd className="mt-1 text-sm text-zinc-500">{s.label}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}

function RoleRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setI((v) => (v + 1) % profile.roles.length),
      2600,
    );
    return () => window.clearInterval(id);
  }, []);
  return (
    <p className="mt-6 flex items-center gap-3 text-xl text-zinc-300 sm:text-2xl">
      <span
        aria-hidden
        className="h-[1.1em] w-[3px] rounded-full bg-accent shadow-[0_0_12px_rgb(var(--accent))]"
      />
      <span
        className="relative inline-flex h-[1.4em] min-w-0 flex-1 overflow-hidden"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={profile.roles[i]}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            className="absolute left-0 top-0 whitespace-nowrap font-medium text-accent"
          >
            {profile.roles[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}
