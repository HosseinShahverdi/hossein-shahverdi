"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/core/TransitionLink";
import { useIntro } from "@/components/core/IntroProvider";
import { cn, EASE_OUT } from "@/lib/utils";

type Side = "engineering" | "research";

const SIDES: Record<
  Side,
  {
    href: string;
    title: string;
    body: string;
    points: string[];
    accent: string;
    bg: string;
    serif: boolean;
  }
> = {
  engineering: {
    href: "/engineering",
    title: "Engineering",
    body: "Full-stack products, security tooling and the infrastructure that runs models in production.",
    points: ["Next.js and React", "Python and FastAPI", "Recon and hardening"],
    accent: "#22e3ff",
    bg: "#03080a",
    serif: false,
  },
  research: {
    href: "/research",
    title: "Research",
    body: "Lightweight Transformers, generative medical imaging and explainable AI. Eight publications.",
    points: ["Time-series deep learning", "MRI synthesis", "Explainable AI"],
    accent: "#a78bfa",
    bg: "#0a0722",
    serif: true,
  },
};

export default function Gateway() {
  const [hover, setHover] = useState<Side | null>(null);
  const { ready } = useIntro();

  useEffect(() => {
    document.documentElement.dataset.world = "home";
  }, []);

  return (
    <main
      id="main"
      className="relative flex h-[100svh] flex-col overflow-hidden bg-black md:flex-row"
    >
      {(Object.keys(SIDES) as Side[]).map((key, i) => (
        <Panel
          key={key}
          side={key}
          index={i}
          ready={ready}
          grow={hover === key ? 1.3 : hover ? 0.7 : 1}
          dimmed={hover !== null && hover !== key}
          onHover={setHover}
        />
      ))}

      {/* Shared top bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: 0.2, duration: 0.8, ease: EASE_OUT }}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-5 sm:p-8"
      >
        <span className="font-display text-lg font-semibold tracking-[0.01em] text-white sm:text-xl">
          {" "}
          Hossein Shahverdi
        </span>
        <span className="flex items-center gap-2 text-[13px] text-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          <span className="hidden sm:inline">Available for opportunities</span>
        </span>
      </motion.div>

      {/* Center seam */}
      <motion.div
        aria-hidden
        initial={{ scale: 0, opacity: 0 }}
        animate={
          ready ? { scale: hover ? 0.6 : 1, opacity: hover ? 0 : 1 } : undefined
        }
        transition={{ delay: 0.6, duration: 0.8, ease: EASE_OUT }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-black/70 font-serif text-lg italic text-zinc-300 backdrop-blur">
          or
        </span>
      </motion.div>
    </main>
  );
}

function Panel({
  side,
  index,
  ready,
  grow,
  dimmed,
  onHover,
}: {
  side: Side;
  index: number;
  ready: boolean;
  grow: number;
  dimmed: boolean;
  onHover: (s: Side | null) => void;
}) {
  const s = SIDES[side];
  const isEng = side === "engineering";

  return (
    <motion.div
      className="relative min-h-0 min-w-0 basis-0 overflow-hidden"
      initial={{
        flexGrow: 1,
        clipPath: isEng ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
      }}
      animate={
        ready
          ? { flexGrow: grow, clipPath: "inset(0 0% 0 0%)" }
          : { flexGrow: grow }
      }
      transition={{
        flexGrow: { duration: 0.8, ease: EASE_OUT },
        clipPath: { duration: 1.2, ease: EASE_OUT, delay: index * 0.12 },
      }}
      style={{ background: s.bg }}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(side)}
      onPointerLeave={() => onHover(null)}
    >
      <TransitionLink
        href={s.href}
        data-cursor-label="Enter"
        aria-label={`Enter the ${s.title.toLowerCase()} world`}
        onFocus={() => onHover(side)}
        onBlur={() => onHover(null)}
        className="focus-ring group absolute inset-0 flex flex-col justify-end p-6 pb-10 sm:p-10 md:p-12"
      >
        {/* Art */}
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-105"
        >
          {isEng ? (
            <>
              <div className="grid-bg absolute inset-0 opacity-80" />
              <div className="absolute inset-0 [--accent:34_227_255]">
                <div className="grid-floor" />
              </div>
            </>
          ) : (
            <DotField />
          )}
          <div
            className="absolute left-1/2 top-1/3 h-[60%] w-[80%] -translate-x-1/2 rounded-full blur-[110px] transition-opacity duration-700"
            style={{ background: s.accent, opacity: dimmed ? 0.05 : 0.16 }}
          />
        </div>
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-black transition-opacity duration-700",
            dimmed ? "opacity-50" : "opacity-0",
          )}
        />

        {/* Content */}
        <div className="relative">
          <motion.h2
            animate={{ scale: dimmed ? 0.6 : 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            style={{ transformOrigin: "0% 100%" }}
            className={cn(
              "whitespace-nowrap leading-[0.85] text-white",
              s.serif
                ? "font-serif text-[15vw] italic md:text-[clamp(3.5rem,6.4vw,7.5rem)]"
                : "font-display text-[9vw] font-bold tracking-[0.005em] md:text-[clamp(2.4rem,4.3vw,5.25rem)]",
            )}
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={ready ? { y: "0%" } : undefined}
                transition={{
                  delay: 0.5 + index * 0.12,
                  duration: 1,
                  ease: EASE_OUT,
                }}
              >
                {s.title}
              </motion.span>
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{
              delay: 0.8 + index * 0.12,
              duration: 0.8,
              ease: EASE_OUT,
            }}
            className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="max-w-sm">
              <p className="text-[15px] leading-relaxed text-zinc-300">
                {s.body}
              </p>
              <ul className="mt-4 hidden flex-wrap gap-1.5 sm:flex">
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="rounded-full border px-2.5 py-1 text-[12px]"
                    style={{ borderColor: `${s.accent}40`, color: s.accent }}
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <span
              className="grid h-14 w-14 shrink-0 place-items-center rounded-full border transition-all duration-500 group-hover:rotate-45 group-hover:scale-110"
              style={{
                borderColor: `${s.accent}80`,
                color: s.accent,
                boxShadow: `0 0 40px -10px ${s.accent}`,
              }}
            >
              <ArrowUpRight size={22} />
            </span>
          </motion.div>
        </div>
      </TransitionLink>
    </motion.div>
  );
}

/** Static neural motif for the research panel. */
function DotField() {
  const round = (value: number) => Math.round(value * 1000) / 1000;
  const pts = Array.from({ length: 42 }, (_, i) => {
    const a = i * 2.39996;
    const r = Math.sqrt(i + 1) * 38;
    return { x: round(300 + Math.cos(a) * r), y: round(300 + Math.sin(a) * r) };
  });
  return (
    <svg
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full text-[#a78bfa]"
    >
      {pts.map((p, i) =>
        pts
          .slice(i + 1)
          .map((q, j) =>
            Math.hypot(p.x - q.x, p.y - q.y) < 70 ? (
              <line
                key={`${i}-${j}`}
                x1={p.x}
                y1={p.y}
                x2={q.x}
                y2={q.y}
                stroke="currentColor"
                strokeOpacity="0.2"
              />
            ) : null,
          ),
      )}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i % 7 === 0 ? 3.5 : 2}
          fill="currentColor"
          fillOpacity={i % 7 === 0 ? 0.9 : 0.5}
        />
      ))}
    </svg>
  );
}
