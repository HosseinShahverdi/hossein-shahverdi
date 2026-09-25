"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { publications, researchInterests } from "@/lib/data";
import { useIntro } from "@/components/core/IntroProvider";
import { Magnetic } from "@/components/core/Magnetic";
import { TransitionLink } from "@/components/core/TransitionLink";
import { EASE_OUT } from "@/lib/utils";

const LINES = ["Small models for", "streaming signals.", "Clear explanations", "for clinical AI."];

export default function ResearchHero() {
  const { ready } = useIntro();

  return (
    <section id="intro" className="relative flex min-h-[100svh] items-center pb-20 pt-32 sm:pt-36">
      <div className="container-x grid items-end gap-14 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.1, duration: 0.8, ease: EASE_OUT }}
            className="text-[15px] text-accent2"
          >
            Hossein Shahverdi, M.Sc. Telecommunications Engineering
          </motion.p>

          <h1 className="mt-6 font-serif text-[clamp(2.9rem,7vw,6.75rem)] leading-[0.92] text-white">
            <span className="sr-only">{LINES.join(" ")}</span>
            {LINES.map((line, i) => (
              <span key={line} aria-hidden className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={i % 2 === 1 ? "block italic text-white/70" : "block"}
                  initial={{ y: "110%" }}
                  animate={ready ? { y: "0%" } : undefined}
                  transition={{ delay: 0.2 + i * 0.1, duration: 1.1, ease: EASE_OUT }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.7, duration: 0.9, ease: EASE_OUT }}
            className="mt-8 max-w-xl text-lg leading-[1.7] text-zinc-300/80"
          >
            My research sits where signal processing meets deep learning: lightweight Transformers for sensor streams,
            generative models for medical imaging, and explainability that clinicians can act on.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.8, duration: 0.9, ease: EASE_OUT }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Magnetic>
              <a
                href="#papers"
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-[#0b0826] shadow-[0_0_50px_-10px_rgb(var(--accent)/0.9)]"
              >
                Read the papers <ArrowDown size={16} />
              </a>
            </Magnetic>
            <Magnetic>
              <TransitionLink
                href="/engineering"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-[15px] text-white transition-colors hover:border-[#22e3ff]/60 hover:bg-[#22e3ff]/10"
              >
                Switch to engineering
              </TransitionLink>
            </Magnetic>
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.6, duration: 1.1, ease: EASE_OUT }}
          className="glass rounded-[32px] bg-white/[0.04] p-7"
          aria-label="Research summary"
        >
          <p className="text-sm text-zinc-400">Currently</p>
          <p className="mt-2 font-serif text-3xl leading-tight text-white">
            Applying to PhD programmes in efficient and trustworthy AI.
          </p>

          <dl className="mt-8 grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-5 text-center">
            <div>
              <dd className="font-serif text-4xl text-white">{publications.length}</dd>
              <dt className="mt-1 text-xs text-zinc-400">Publications</dt>
            </div>
            <div>
              <dd className="font-serif text-4xl text-white">3</dd>
              <dt className="mt-1 text-xs text-zinc-400">Research areas</dt>
            </div>
            <div>
              <dd className="font-serif text-4xl text-white">20/20</dd>
              <dt className="mt-1 text-xs text-zinc-400">Thesis grade</dt>
            </div>
          </dl>

          <p className="mt-6 text-sm text-zinc-400">Interests</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {researchInterests.map((r) => (
              <li key={r} className="chip border-accent/20 bg-accent/[0.08] text-violet-100">
                {r}
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </section>
  );
}
