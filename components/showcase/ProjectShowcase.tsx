"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, FileText, X } from "lucide-react";
import type { Project } from "@/lib/data";
import { TiltCard } from "@/components/core/TiltCard";
import { Reveal } from "@/components/core/Reveal";
import { GithubIcon } from "@/components/core/icons";
import { cn } from "@/lib/utils";
import ProjectArt from "./ProjectArt";
import StatusBadge from "./StatusBadge";

type Variant = "engineering" | "research";

/** Bento grid of project cards. Clicking a card morphs it into a detail sheet. */
export default function ProjectShowcase({ projects, variant }: { projects: Project[]; variant: Variant }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal
            key={p.id}
            delay={(i % 3) * 0.08}
            className={cn("h-full min-w-0", p.featured && "lg:col-span-2")}
          >
            <ProjectCard project={p} index={i} variant={variant} onOpen={() => setSelected(p)} />
          </Reveal>
        ))}
      </div>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {selected && <ProjectModal key={selected.id} project={selected} variant={variant} onClose={() => setSelected(null)} />}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function ProjectCard({
  project: p,
  index,
  variant,
  onOpen,
}: {
  project: Project;
  index: number;
  variant: Variant;
  onOpen: () => void;
}) {
  return (
    <motion.article layoutId={`card-${p.id}`} className="h-full rounded-[28px]">
      <TiltCard className="glass flex h-full flex-col overflow-hidden rounded-[28px]">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open details for ${p.title}`}
          data-cursor-label="Open"
          className="focus-ring absolute inset-0 z-10 rounded-[28px]"
        />
        <div className={cn("relative overflow-hidden border-b border-white/[0.06]", p.featured ? "h-56 sm:h-64" : "h-48")}>
          <ProjectArt variant={p.art} seed={index + 1} />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
            <span className="chip bg-black/40 backdrop-blur">{p.category}</span>
            <StatusBadge status={p.status} />
          </div>
        </div>

        <div className="relative flex flex-1 flex-col p-6">
          <div className="flex items-baseline justify-between gap-4">
            <motion.h3
              layoutId={`title-${p.id}`}
              className={
                variant === "engineering"
                  ? "font-display text-2xl font-bold tracking-tight text-white"
                  : "font-serif text-3xl leading-tight text-white"
              }
            >
              {p.title}
            </motion.h3>
            <span className="shrink-0 text-xs tabular-nums text-zinc-500">{p.year}</span>
          </div>
          <p className="mt-1.5 text-[15px] text-accent">{p.tagline}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">{p.description}</p>

          <div className="reveal-rows grid">
            <ul className="overflow-hidden">
              {p.highlights.slice(0, 3).map((h) => (
                <li key={h} className="mt-2 flex gap-2 text-sm text-zinc-300 first:mt-4">
                  <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {p.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>

          <ProjectLinks project={p} className="relative z-20 mt-5" />
        </div>
      </TiltCard>
    </motion.article>
  );
}

function ProjectLinks({ project: p, className }: { project: Project; className?: string }) {
  const live = p.demo && p.demo !== "#";
  const code = p.github && p.github !== "#";
  const paper = p.paper && p.paper !== "#";
  const base =
    "focus-ring inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] transition-colors";

  if (!live && !code && !paper) {
    return (
      <p className={cn("text-[13px] text-zinc-500", className)}>
        {p.status === "Concept" || p.status === "Planned" ? "Repository opens when work starts" : "Links coming soon"}
      </p>
    );
  }
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {live && (
        <a href={p.demo} target="_blank" rel="noreferrer" className={cn(base, "border-accent/40 bg-accent/10 text-white hover:bg-accent/20")}>
          Live demo <ArrowUpRight size={14} />
        </a>
      )}
      {code && (
        <a href={p.github} target="_blank" rel="noreferrer" className={cn(base, "border-white/10 text-zinc-300 hover:text-white")}>
          <GithubIcon className="h-3.5 w-3.5" /> Source
        </a>
      )}
      {paper && (
        <a href={p.paper} target="_blank" rel="noreferrer" className={cn(base, "border-white/10 text-zinc-300 hover:text-white")}>
          <FileText size={14} /> Read the paper
        </a>
      )}
    </div>
  );
}

function ProjectModal({ project: p, variant, onClose }: { project: Project; variant: Variant; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div data-world={variant} className="fixed inset-0 z-[70]">
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-3 sm:items-center sm:p-6">
        <motion.div
          layoutId={`card-${p.id}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`dialog-${p.id}`}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="glass pointer-events-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-surface/90"
        >
          <div className="relative h-52 overflow-hidden border-b border-white/[0.06] sm:h-64">
            <ProjectArt variant={p.art} seed={3} />
            <div className="absolute left-5 top-5 flex gap-2">
              <span className="chip bg-black/40">{p.category}</span>
              <StatusBadge status={p.status} />
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="focus-ring absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/80"
            >
              <X size={18} />
            </button>
          </div>

          <motion.div
            className="p-6 sm:p-9"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.12, duration: 0.4 }}
          >
            <motion.h3
              layoutId={`title-${p.id}`}
              id={`dialog-${p.id}`}
              className={
                variant === "engineering"
                  ? "font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
                  : "font-serif text-5xl leading-none text-white sm:text-6xl"
              }
            >
              {p.title}
            </motion.h3>
            <p className="mt-2 text-lg text-accent">{p.tagline}</p>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-zinc-300">{p.description}</p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 text-sm text-zinc-300">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <ProjectLinks project={p} className="mt-8" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
