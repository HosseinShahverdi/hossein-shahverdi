"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { experiments, type Experiment } from "@/lib/data";
import SectionHeader from "@/components/layout/SectionHeader";
import StatusBadge from "@/components/showcase/StatusBadge";
import { Reveal } from "@/components/core/Reveal";
import { EASE_IN_OUT } from "@/lib/utils";

export default function Lab() {
  return (
    <section id="lab" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeader
          variant="research"
          title="Open questions"
          description="Experiments I'm running or about to run, each one a bridge between my research and security. Flip a card to see the approach."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {experiments.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08}>
              <FlipCard exp={e} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlipCard({ exp }: { exp: Experiment }) {
  const [flipped, setFlipped] = useState(false);
  const face =
    "absolute inset-0 flex flex-col rounded-[28px] border border-white/10 p-6 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]";

  return (
    <div
      className="h-[360px] [perspective:1400px]"
      onPointerEnter={(e) => e.pointerType === "mouse" && setFlipped(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setFlipped(false)}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: EASE_IN_OUT }}
      >
        {/* Front */}
        <div className={`${face} bg-gradient-to-b from-[#1a1447] to-[#0e0b2c]`} aria-hidden={flipped}>
          <div className="flex items-center justify-between">
            <StatusBadge status={exp.status} />
          </div>
          <h3 className="mt-auto font-serif text-4xl text-white">{exp.name}</h3>
          <p className="mt-3 text-[17px] leading-snug text-zinc-300">{exp.question}</p>
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="focus-ring mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-[13px] text-zinc-300"
          >
            <RotateCw size={13} /> See the approach
          </button>
        </div>
        {/* Back */}
        <div
          className={`${face} bg-gradient-to-b from-[#2a1f6b] to-[#120e38] [transform:rotateY(180deg)]`}
          aria-hidden={!flipped}
        >
          <p className="text-sm text-accent2">Approach</p>
          <p className="mt-3 text-[15px] leading-relaxed text-zinc-200">{exp.approach}</p>
          <div className="mt-auto flex flex-wrap gap-1.5">
            {exp.stack.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setFlipped(false)}
            className="focus-ring mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-[13px] text-zinc-300"
          >
            <RotateCw size={13} /> Back to the question
          </button>
        </div>
      </motion.div>
    </div>
  );
}
