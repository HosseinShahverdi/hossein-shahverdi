"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { profile, publications, engineeringSkills, researchInterests, type Publication } from "@/lib/data";
import SectionHeader from "@/components/layout/SectionHeader";
import ProjectShowcase from "@/components/showcase/ProjectShowcase";
import Timeline from "@/components/showcase/Timeline";
import { Reveal, SplitWords } from "@/components/core/Reveal";
import { Magnetic } from "@/components/core/Magnetic";
import { GithubIcon, LinkedinIcon } from "@/components/core/icons";
import { cn } from "@/lib/utils";

const Wrap = ({ id, world, children, className }: { id: string; world: "research" | "engineering" | "home"; children: React.ReactNode; className?: string }) => (
  <section id={id} data-world={world} className={cn("relative bg-base py-24 sm:py-32", className)}>
    <div className="container-x">{children}</div>
  </section>
);

/* ------------------------------------------------------------ research */

export function Studies() {
  const { t, content } = useI18n();
  return (
    <Wrap id="studies" world="research">
      <SectionHeader variant="research" title={t.studies.title} description={t.studies.description} />
      <ProjectShowcase projects={content.researchProjects} variant="research" />
    </Wrap>
  );
}

const TYPES: Publication["type"][] = ["Journal", "Conference", "Preprint", "Abstract"];

export function Papers() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Publication["type"] | "all">("all");
  const list = useMemo(() => publications.filter((p) => filter === "all" || p.type === filter), [filter]);
  const me = `${profile.last}, H.`;
  const bold = (authors: string) =>
    authors.split(me).flatMap((part, i, arr) => (i < arr.length - 1 ? [part, <strong key={i} className="font-semibold text-white">{me}</strong>] : [part]));

  return (
    <Wrap id="papers" world="research">
      <SectionHeader
        variant="research"
        title={t.papers.title}
        description={t.papers.description}
        aside={
          <a href={profile.links.scholar} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-zinc-200 transition-colors hover:border-accent/50 hover:text-white">
            {t.papers.scholar} <ArrowUpRight size={14} />
          </a>
        }
      />

      <Reveal>
        <dl className="mb-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {t.stats.map((s) => (
            <div key={s.label} className="bg-base px-5 py-6">
              <dt className="font-serif text-4xl text-white sm:text-5xl">{s.value}</dt>
              <dd className="mt-1 hyphens-auto text-[13px] leading-snug text-zinc-500">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <div role="tablist" className="mb-6 flex flex-wrap gap-2">
        {(["all", ...TYPES] as const).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn("focus-ring rounded-full border px-4 py-2 text-[13px] transition-colors", filter === f ? "border-accent/50 bg-accent/15 text-white" : "border-white/10 text-zinc-400 hover:text-white")}
          >
            {f === "all" ? t.papers.all : t.papers.types[f]}
          </button>
        ))}
      </div>

      <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((p) => (
            <motion.li key={p.title} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="group grid gap-x-8 gap-y-2 py-6 md:grid-cols-[5rem_1fr_auto]">
              <span className="font-serif text-3xl text-accent tabular-nums">{p.year}</span>
              <div className="min-w-0">
                <h3 className="hyphens-auto text-[17px] font-medium leading-snug text-white">{p.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{bold(p.authors)}</p>
                <p className="mt-1 text-sm italic text-zinc-400">{p.venue}</p>
              </div>
              <div className="flex items-start gap-3 md:justify-end">
                <span className="chip">{t.papers.types[p.type]}</span>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noreferrer" aria-label={`${t.papers.open}: ${p.title}`} className="focus-ring grid h-8 w-8 place-items-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:border-accent/60 hover:text-white">
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <Reveal className="mt-14">
        <p className="mb-3 text-xs uppercase tracking-[0.24em] text-accent">{t.papers.interests}</p>
        <div className="flex flex-wrap gap-2">
          {researchInterests.map((i) => (
            <span key={i} className="chip px-3.5 py-1.5 text-[13px]">
              {i}
            </span>
          ))}
        </div>
      </Reveal>
    </Wrap>
  );
}

export function Journey() {
  const { t, content } = useI18n();
  return (
    <Wrap id="journey" world="research" className="pb-36">
      <SectionHeader variant="research" title={t.journey.title} description={t.journey.description} />
      <Timeline items={content.researchTimeline} variant="research" />
    </Wrap>
  );
}

/* --------------------------------------------------------- programming */

export function Projects() {
  const { t, content } = useI18n();
  return (
    <Wrap id="projects" world="engineering">
      <SectionHeader title={t.projects.title} description={t.projects.description} />
      <ProjectShowcase projects={content.engineeringProjects} variant="engineering" />
    </Wrap>
  );
}

const TIER_PIPS = { core: 3, strong: 2, learning: 1 } as const;
const GROUPS = ["Frontend", "Backend", "Data & infra"] as const;

export function Toolkit() {
  const { t } = useI18n();
  return (
    <Wrap id="toolkit" world="engineering">
      <SectionHeader title={t.toolkit.title} description={t.toolkit.description} />
      <div className="grid gap-5 lg:grid-cols-3">
        {GROUPS.map((g, gi) => (
          <Reveal key={g} delay={gi * 0.08} className="h-full">
            <div className="glass h-full rounded-3xl p-6">
              <h3 className="mb-5 font-display text-lg font-bold text-white">{t.toolkit.groups[g]}</h3>
              <ul className="space-y-3">
                {engineeringSkills
                  .filter((s) => s.group === g)
                  .map((s) => (
                    <li key={s.name} className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 font-mono text-[12px] text-accent">{s.short}</span>
                      <span className="min-w-0 flex-1 truncate text-[15px] text-zinc-200">{s.name}</span>
                      <span className="flex items-center gap-2" title={t.toolkit.tiers[s.tier]}>
                        <span className="hidden text-[11px] text-zinc-500 sm:inline">{t.toolkit.tiers[s.tier]}</span>
                        <span aria-hidden className="flex gap-0.5">
                          {[0, 1, 2].map((i) => (
                            <span key={i} className={cn("h-3 w-1 rounded-full", i < TIER_PIPS[s.tier] ? "bg-accent" : "bg-white/10")} />
                          ))}
                        </span>
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Wrap>
  );
}

export function Experience() {
  const { t, content } = useI18n();
  return (
    <Wrap id="experience" world="engineering" className="pb-36">
      <SectionHeader title={t.experience.title} description={t.experience.description} />
      <Timeline items={content.engineeringTimeline} variant="engineering" />
    </Wrap>
  );
}

/* ------------------------------------------------------------- contact */

export function Contact() {
  const { t } = useI18n();
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
  const links = [
    { href: profile.links.github, label: t.contact.links.github, icon: <GithubIcon className="h-4 w-4" /> },
    { href: profile.links.linkedin, label: t.contact.links.linkedin, icon: <LinkedinIcon className="h-4 w-4" /> },
    { href: profile.links.scholar, label: t.contact.links.scholar, icon: <ArrowUpRight size={16} /> },
    { href: profile.links.lab, label: t.contact.links.lab, icon: <ArrowUpRight size={16} /> },
  ];
  return (
    <section id="contact" data-world="home" className="relative overflow-hidden bg-[#05070a] py-32 sm:py-44">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[10%] bottom-[-30%] h-[70vh] w-[60vw] rounded-full bg-[rgb(167_139_250/0.12)] blur-[140px]" />
        <div className="absolute -right-[10%] bottom-[-30%] h-[70vh] w-[60vw] rounded-full bg-[rgb(34_227_255/0.10)] blur-[140px]" />
      </div>
      <div className="container-x relative text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-zinc-500">{t.contact.kicker}</p>
        <h2 className="mx-auto max-w-4xl hyphens-auto font-display text-[clamp(2.2rem,6.4vw,5.6rem)] font-bold leading-[0.98] tracking-tight text-white">
          <SplitWords text={t.contact.title} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">{t.contact.text}</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Magnetic strength={0.4}>
            <a href={`mailto:${profile.email}`} data-cursor-label={t.contact.write} className="focus-ring inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-[16px] font-semibold text-black">
              <Mail size={18} /> {profile.email}
            </a>
          </Magnetic>
          <button type="button" onClick={copy} className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-[15px] text-zinc-200 transition-colors hover:border-white/40 hover:text-white">
            {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
            <span aria-live="polite">{copied ? t.contact.copied : t.contact.copy}</span>
          </button>
        </Reveal>
        <Reveal delay={0.4} className="mt-10 flex flex-wrap justify-center gap-2">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-white/30 hover:text-white">
              {l.icon} {l.label}
            </a>
          ))}
        </Reveal>
        <p className="mt-20 text-[13px] text-zinc-600">
          © {new Date().getFullYear()} {t.contact.rights} · {t.contact.location} {profile.location}
        </p>
      </div>
    </section>
  );
}

/** A gradient seam that carries the eye from the violet world into the teal one. */
export function Bridge() {
  return (
    <div aria-hidden className="relative h-[36vh] overflow-hidden" style={{ background: "linear-gradient(to bottom, rgb(8 6 26), rgb(4 6 8))" }}>
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-40 w-[70vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(167_139_250/0.25),rgb(34_227_255/0.18),transparent)] blur-2xl" />
    </div>
  );
}
