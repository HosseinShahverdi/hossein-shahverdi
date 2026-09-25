"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Mail } from "lucide-react";
import { profile } from "@/lib/data";
import { Magnetic } from "@/components/core/Magnetic";
import { SplitWords, Reveal } from "@/components/core/Reveal";
import { GithubIcon, LinkedinIcon } from "@/components/core/icons";
import { cn } from "@/lib/utils";

export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-[15px] text-zinc-200 transition-colors hover:border-accent/50 hover:text-white",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "y" : "n"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.15 }}
        >
          {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
        </motion.span>
      </AnimatePresence>
      <span aria-live="polite">{copied ? "Email copied" : "Copy email"}</span>
    </button>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-32 sm:py-44">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-[-30%] left-1/2 h-[70vh] w-[80vw] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[140px]" />
      </div>
      <div className="container-x text-center">
        <h2 className="mx-auto max-w-5xl font-display text-[clamp(2.8rem,9vw,8rem)] font-extrabold leading-[0.9] tracking-tight text-white">
          <SplitWords text="Let's build something that ships." />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-lg text-lg text-zinc-400">
            Roles, collaborations, or a system that needs to be fast and hard to break. I reply within a day.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Magnetic strength={0.4}>
            <a
              href={`mailto:${profile.email}`}
              data-cursor-label="Say hi"
              className="focus-ring inline-flex items-center gap-2.5 rounded-full bg-accent px-7 py-4 text-base font-semibold text-black shadow-[0_0_60px_-10px_rgb(var(--accent)/0.9)]"
            >
              <Mail size={18} /> {profile.email}
            </a>
          </Magnetic>
          <CopyEmail />
        </Reveal>
        <Reveal delay={0.4} className="mt-8 flex justify-center gap-6 text-sm text-zinc-400">
          <a href={profile.links.github} className="focus-ring inline-flex items-center gap-2 rounded hover:text-white">
            <GithubIcon className="h-4 w-4" /> GitHub
          </a>
          <a href={profile.links.linkedin} className="focus-ring inline-flex items-center gap-2 rounded hover:text-white">
            <LinkedinIcon className="h-4 w-4" /> LinkedIn
          </a>
        </Reveal>
      </div>
    </section>
  );
}
