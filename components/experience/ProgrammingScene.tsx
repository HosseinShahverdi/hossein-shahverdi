"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useSceneProgress } from "./useSceneProgress";

/* ---------------------------------------------------------------- code */

type Tok = [string, string?];
const C = { k: "text-accent", f: "text-accent2", s: "text-amber-200", c: "text-zinc-500", n: "text-fuchsia-300" } as const;
const CODE: Tok[][] = [
  [["async def ", C.k], ["rescan", C.f], ["(scope: Scope):"]],
  [["    found = ", ], ["await ", C.k], ["enumerate", C.f], ["(scope)  "], ["# subfinder + amass", C.c]],
  [["    live  = ", ], ["await ", C.k], ["probe", C.f], ["(found)    "], ["# httpx", C.c]],
  [["    known = store.", ], ["assets", C.f], ["(scope)"]],
  [["    new   = ", ], ["diff", C.f], ["(live, known)"]],
  [["    ", ], ["await ", C.k], ["store.", ], ["save", C.f], ["(scope, live)"]],
  [["    ", ], ["return ", C.k], ["Report", C.f], ["(new=new, total=", ], ["len", C.f], ["(live))"]],
];

function CodeLine({ tokens, i, p }: { tokens: Tok[]; i: number; p: MotionValue<number> }) {
  const at = 0.04 + i * 0.035;
  const opacity = useTransform(p, [at, at + 0.04], [0, 1]);
  const x = useTransform(p, [at, at + 0.04], [-14, 0]);
  return (
    <motion.div style={{ opacity, x }} className="flex whitespace-pre">
      <span className="mr-3 w-5 shrink-0 select-none text-right text-zinc-600 sm:mr-4">{i + 1}</span>
      <span>
        {tokens.map(([text, cls], j) => (
          <span key={j} className={cls}>
            {text}
          </span>
        ))}
      </span>
    </motion.div>
  );
}

/* ---------------------------------------------------------- architecture */

type NodeDef = { id: string; x: number; y: number; label: string; sub: string; at: number };
const NODES: NodeDef[] = [
  { id: "client", x: 20, y: 200, label: "Client", sub: "Next.js", at: 0 },
  { id: "gateway", x: 210, y: 200, label: "Gateway", sub: "FastAPI", at: 0.08 },
  { id: "auth", x: 410, y: 70, label: "Auth", sub: "JWT · RBAC", at: 0.2 },
  { id: "api", x: 410, y: 200, label: "Scan API", sub: "REST · WS", at: 0.28 },
  { id: "queue", x: 410, y: 330, label: "Queue", sub: "jobs", at: 0.4 },
  { id: "workers", x: 610, y: 330, label: "Workers", sub: "Docker", at: 0.52 },
  { id: "store", x: 610, y: 200, label: "Store", sub: "MongoDB", at: 0.64 },
  { id: "model", x: 610, y: 70, label: "Scorer", sub: "PyTorch", at: 0.76 },
];
const W = 130;
const Hn = 52;
const EDGES: { from: string; to: string; at: number }[] = [
  { from: "client", to: "gateway", at: 0.05 },
  { from: "gateway", to: "auth", at: 0.16 },
  { from: "gateway", to: "api", at: 0.24 },
  { from: "api", to: "queue", at: 0.36 },
  { from: "queue", to: "workers", at: 0.48 },
  { from: "workers", to: "store", at: 0.6 },
  { from: "api", to: "store", at: 0.68 },
  { from: "api", to: "model", at: 0.72 },
];
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const edgePath = (a: NodeDef, b: NodeDef) => {
  const horizontal = Math.abs(b.x - a.x) > 20;
  const ax = horizontal ? a.x + (b.x > a.x ? W : 0) : a.x + W / 2;
  const ay = horizontal ? a.y + Hn / 2 : a.y + (b.y > a.y ? Hn : 0);
  const bx = horizontal ? b.x + (b.x > a.x ? 0 : W) : b.x + W / 2;
  const by = horizontal ? b.y + Hn / 2 : b.y + (b.y > a.y ? 0 : Hn);
  return horizontal ? `M${ax} ${ay} C${ax + (bx - ax) / 2} ${ay} ${ax + (bx - ax) / 2} ${by} ${bx} ${by}` : `M${ax} ${ay} L${bx} ${by}`;
};

function ArchNode({ n, p }: { n: NodeDef; p: MotionValue<number> }) {
  const o = useTransform(p, [n.at, n.at + 0.08], [0, 1]);
  const s = useTransform(p, [n.at, n.at + 0.08], [0.7, 1]);
  return (
    <motion.g style={{ opacity: o, scale: s, originX: `${n.x + W / 2}px`, originY: `${n.y + Hn / 2}px` }}>
      <rect x={n.x} y={n.y} width={W} height={Hn} rx={14} fill="rgb(var(--surface))" stroke="rgb(var(--accent))" strokeOpacity="0.55" />
      <text x={n.x + 14} y={n.y + 23} fill="#fff" fontSize="14" fontWeight="600" fontFamily="var(--font-geist-sans)">
        {n.label}
      </text>
      <text x={n.x + 14} y={n.y + 40} fill="rgb(var(--accent))" fontSize="11" fontFamily="var(--font-geist-mono)">
        {n.sub}
      </text>
      <circle cx={n.x + W - 14} cy={n.y + 14} r={3} fill="rgb(var(--accent-2))" />
    </motion.g>
  );
}
function ArchEdge({ d, at, p }: { d: string; at: number; p: MotionValue<number> }) {
  const len = useTransform(p, [at, at + 0.12], [0, 1]);
  return <motion.path d={d} fill="none" stroke="rgb(var(--accent))" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" style={{ pathLength: len }} />;
}

/* ------------------------------------------------------------------ app */

const ROWS = [
  { host: "api.acme.io", st: "200", tech: "nginx · Node", fresh: false },
  { host: "staging.acme.io", st: "403", tech: "Cloudflare", fresh: true },
  { host: "vpn.acme.io", st: "302", tech: "OpenVPN", fresh: false },
  { host: "grafana.acme.io", st: "200", tech: "Grafana 10", fresh: true },
  { host: "docs.acme.io", st: "200", tech: "Next.js", fresh: false },
  { host: "old-admin.acme.io", st: "401", tech: "Apache 2.2", fresh: true },
];

function AppRow({ r, i, p }: { r: (typeof ROWS)[number]; i: number; p: MotionValue<number> }) {
  const at = 0.12 + i * 0.1;
  const o = useTransform(p, [at, at + 0.1], [0, 1]);
  const y = useTransform(p, [at, at + 0.1], [14, 0]);
  return (
    <motion.li style={{ opacity: o, y }} className={cn("grid grid-cols-[1fr_auto] items-center gap-2 border-b border-white/[0.06] px-3 py-2.5 text-[12px] sm:grid-cols-[1.4fr_auto_1fr_auto] sm:text-[13px]", r.fresh && "bg-accent/[0.07]")}>
      <span className="truncate font-mono text-white">{r.host}</span>
      <span className="font-mono text-zinc-400">{r.st}</span>
      <span className="hidden truncate text-zinc-500 sm:block">{r.tech}</span>
      <span className={cn("hidden w-12 justify-self-end rounded-full px-2 py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide sm:block", r.fresh ? "bg-accent/20 text-accent" : "text-transparent")}>new</span>
    </motion.li>
  );
}

function AppWindow({ p }: { p: MotionValue<number> }) {
  const { t } = useI18n();
  const hosts = useTransform(p, [0.1, 0.7], [0, 128]);
  const fresh = useTransform(p, [0.1, 0.7], [0, 7]);
  const hostsText = useTransform(hosts, (v) => String(Math.round(v)));
  const freshText = useTransform(fresh, (v) => String(Math.round(v)));
  return (
    <div className="glass overflow-hidden rounded-2xl shadow-[0_30px_90px_-30px_rgb(var(--accent)/0.5)]">
      <div className="flex items-center gap-2 border-b border-white/[0.08] bg-black/40 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 truncate rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[11px] text-zinc-400">recon.local / acme / {t.programming.windowTitle.toLowerCase().replace(" ", "-")}</span>
      </div>
      <div className="grid grid-cols-3 gap-px bg-white/[0.06]">
        {[
          { l: "Hosts", v: hostsText },
          { l: t.programming.newHosts, v: freshText },
          { l: "Live", v: undefined },
        ].map((s, i) => (
          <div key={i} className="bg-surface px-3 py-2.5 sm:px-4 sm:py-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{s.l}</p>
            <p className="font-display text-2xl font-bold text-white">{s.v ? <motion.span>{s.v}</motion.span> : "94%"}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-surface px-3 py-2.5">
        <span className="rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent">is:new</span>
        <span className="font-mono text-[11px] text-zinc-500">status:200,403 …</span>
      </div>
      <ul className="bg-surface">
        {ROWS.map((r, i) => (
          <AppRow key={r.host} r={r} i={i} p={p} />
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- scene */

/** Programming & Development: code is written, assembles into an architecture, and ships as a working interface. */
export default function ProgrammingScene() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const scrollYProgress = useSceneProgress(ref);
  const sp = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.5 });
  const rest = useMotionValue(1);

  // Phase windows: write (0–.34), assemble (.3–.68), ship (.64–1)
  const codeP = useTransform(sp, [0, 0.32], [0, 1]);
  const archP = useTransform(sp, [0.3, 0.64], [0, 1]);
  const appP = useTransform(sp, [0.64, 0.95], [0, 1]);

  const codeO = useTransform(sp, [0, 0.03, 0.3, 0.38], [0, 1, 1, 0]);
  const codeS = useTransform(sp, [0.3, 0.4], [1, 0.9]);
  const codeX = useTransform(sp, [0.3, 0.4], ["0%", "-8%"]);
  const archO = useTransform(sp, [0.3, 0.38, 0.62, 0.7], [0, 1, 1, 0]);
  const archS = useTransform(sp, [0.3, 0.4, 0.62, 0.7], [0.94, 1, 1, 1.06]);
  const appO = useTransform(sp, [0.62, 0.72], [0, 1]);
  const appS = useTransform(sp, [0.62, 0.74], [0.9, 1]);
  const appY = useTransform(sp, [0.62, 0.74], [40, 0]);
  const titleO = useTransform(sp, [0, 0.06, 0.12], [1, 1, 0]);
  const titleY = useTransform(sp, [0, 0.12], [0, -70]);
  const pillsO = useTransform(sp, [0.08, 0.16], [0, 1]);
  const gridY = useTransform(sp, [0, 1], ["0%", "-12%"]);
  const tokensY = useTransform(sp, [0, 1], [0, -260]);
  const tokensY2 = useTransform(sp, [0, 1], [0, -120]);
  const stepIdx = useTransform(sp, (v): number => (v < 0.33 ? 0 : v < 0.66 ? 1 : 2));

  if (reduce) return <StaticProgramming />;

  return (
    <section id="programming" ref={ref} data-world="engineering" aria-labelledby="programming-title" className="relative h-[460vh] bg-base">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div aria-hidden style={{ y: gridY }} className="grid-floor absolute -inset-x-10 inset-y-0 opacity-50" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_45%_at_60%_50%,rgb(var(--accent)/0.14),transparent_70%)]" />

        {/* drifting code tokens: depth through two parallax speeds */}
        <motion.div aria-hidden style={{ y: tokensY }} className="pointer-events-none absolute inset-0 hidden font-mono text-[13px] text-accent/25 md:block">
          <span className="absolute left-[6%] top-[70%]">{"{ status: 200 }"}</span>
          <span className="absolute right-[7%] top-[88%]">{"await scan()"}</span>
          <span className="absolute left-[44%] top-[104%]">{"POST /api/jobs"}</span>
        </motion.div>
        <motion.div aria-hidden style={{ y: tokensY2 }} className="pointer-events-none absolute inset-0 hidden font-mono text-[12px] text-accent2/20 md:block">
          <span className="absolute right-[18%] top-[62%]">{"<Component />"}</span>
          <span className="absolute left-[22%] top-[96%]">{"docker compose up"}</span>
          <span className="absolute right-[34%] top-[112%]">{"git push origin main"}</span>
        </motion.div>

        <motion.div style={{ opacity: titleO, y: titleY }} className="pointer-events-none absolute inset-x-0 top-[17%] z-0 px-6 text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">{t.programming.kicker}</p>
          <h2 id="programming-title" className="hyphens-auto break-words text-balance font-display text-[clamp(1.9rem,6.4vw,6.4rem)] font-bold leading-[0.98] tracking-tight text-white">
            {t.programming.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] text-zinc-400 sm:text-lg">{t.programming.intro}</p>
        </motion.div>

        {/* Pipeline step labels */}
        <motion.div style={{ opacity: pillsO }} className="absolute left-0 right-0 top-24 z-30 hidden justify-center md:flex">
          <ol className="flex items-center gap-1 rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-md">
            {t.programming.steps.map((s, i) => (
              <StepPill key={s.key} index={i} label={s.title} current={stepIdx} />
            ))}
          </ol>
        </motion.div>

        {/* Stage */}
        <div className="container-x absolute inset-0 z-10 flex items-center justify-center pt-16">
          <div className="relative h-[min(30rem,64svh)] w-full max-w-4xl">
            <motion.div style={{ opacity: codeO, scale: codeS, x: codeX }} className="absolute inset-0 flex items-center">
              <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-[0_30px_90px_-30px_rgb(var(--accent)/0.45)] backdrop-blur">
                <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="ml-3 font-mono text-[11px] text-zinc-500">scanner/rescan.py</span>
                </div>
                <div className="overflow-x-auto p-4 font-mono text-[10px] leading-[1.9] text-zinc-300 sm:p-6 sm:text-[14px]">
                  {CODE.map((tokens, i) => (
                    <CodeLine key={i} tokens={tokens} i={i} p={codeP} />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div style={{ opacity: archO, scale: archS }} className="absolute inset-0 flex items-center">
              <svg viewBox="0 0 760 420" className="h-auto w-full" role="img" aria-label="System architecture">
                {EDGES.map((e) => (
                  <ArchEdge key={e.from + e.to} d={edgePath(byId[e.from], byId[e.to])} at={e.at} p={archP} />
                ))}
                {NODES.map((n) => (
                  <ArchNode key={n.id} n={n} p={archP} />
                ))}
              </svg>
            </motion.div>

            <motion.div style={{ opacity: appO, scale: appS, y: appY }} className="absolute inset-0 flex flex-col justify-center gap-4">
              <AppWindow p={appP} />
              <a
                href="/demos/recon-console/"
                target="_blank"
                rel="noreferrer"
                data-cursor-label="Demo"
                className="focus-ring group inline-flex w-fit items-center gap-2 self-center rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm text-white transition-colors hover:bg-accent/20"
              >
                {t.programming.liveDemo}
                <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Caption */}
        <Caption p={sp} />
      </div>

      <ul className="sr-only">
        {t.programming.steps.map((s) => (
          <li key={s.key}>
            {s.title}. {s.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

function StepPill({ index, label, current }: { index: number; label: string; current: MotionValue<number> }) {
  const bg = useTransform(current, (v) => (v === index ? "rgb(var(--accent) / 0.2)" : "transparent"));
  const color = useTransform(current, (v) => (v === index ? "#fff" : "#71717a"));
  return (
    <li>
      <motion.span style={{ backgroundColor: bg, color }} className="block rounded-full px-4 py-1.5 text-[12px] font-medium">
        <span className="mr-1.5 font-mono opacity-60">{index + 1}</span>
        {label}
      </motion.span>
    </li>
  );
}

function Caption({ p }: { p: MotionValue<number> }) {
  const { t } = useI18n();
  const o = [
    useTransform(p, [0.08, 0.14, 0.28, 0.34], [0, 1, 1, 0]),
    useTransform(p, [0.4, 0.46, 0.6, 0.66], [0, 1, 1, 0]),
    useTransform(p, [0.74, 0.8, 1], [0, 1, 1]),
  ];
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 px-6 text-center">
      <div className="relative mx-auto h-[4.5rem] max-w-md">
        {t.programming.steps.map((s, i) => (
          <motion.p key={s.key} style={{ opacity: o[i] }} className="absolute inset-0 text-sm leading-relaxed text-zinc-300 sm:text-[16px]">
            <span className="mb-1 block font-display text-lg font-bold text-white">{s.title}</span>
            {s.text}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

/** Reduced-motion variant: the three finished states, stacked and static. */
function StaticProgramming() {
  const { t } = useI18n();
  const done = useMotionValue(1);
  return (
    <section id="programming" data-world="engineering" aria-labelledby="programming-title" className="relative overflow-hidden bg-base py-28">
      <div aria-hidden className="grid-floor absolute inset-0 opacity-30" />
      <div className="container-x relative">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-accent">{t.programming.kicker}</p>
        <h2 id="programming-title" className="hyphens-auto break-words text-balance font-display text-[clamp(1.9rem,6.4vw,5.5rem)] font-bold leading-[0.98] tracking-tight text-white">
          {t.programming.title}
        </h2>
        <p className="mt-5 max-w-xl text-lg text-zinc-400">{t.programming.intro}</p>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-5 font-mono text-[13px] leading-[1.9] text-zinc-300">
            {CODE.map((tokens, i) => (
              <CodeLine key={i} tokens={tokens} i={i} p={done} />
            ))}
          </div>
          <svg viewBox="0 0 760 420" className="h-auto w-full" role="img" aria-label="System architecture">
            {EDGES.map((e) => (
              <ArchEdge key={e.from + e.to} d={edgePath(byId[e.from], byId[e.to])} at={0} p={done} />
            ))}
            {NODES.map((n) => (
              <ArchNode key={n.id} n={n} p={done} />
            ))}
          </svg>
        </div>
        <div className="mt-8">
          <AppWindow p={done} />
        </div>
      </div>
    </section>
  );
}
