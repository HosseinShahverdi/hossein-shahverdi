"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

type Pt = { x: number; y: number };
const W = 1000;
const H = 700;

/** Deterministic layers (no randomness, so server and client agree). */
function layer(x: number, n: number, jitter: number, seed: number): Pt[] {
  return Array.from({ length: n }, (_, i) => ({
    x: x + Math.sin(seed + i * 2.3) * jitter,
    y: 90 + ((H - 180) / (n - 1)) * i + Math.cos(seed * 1.7 + i * 1.9) * 16,
  }));
}
const LEFT = [layer(40, 5, 8, 1), layer(135, 6, 10, 2), layer(232, 5, 8, 3)];
const RIGHT = [layer(960, 5, 8, 4), layer(865, 6, 10, 5), layer(768, 5, 8, 6)];
const CORE: Pt = { x: 500, y: 290 };

const links = (a: Pt[], b: Pt[]) => a.flatMap((p) => b.map((q) => `M${p.x} ${p.y} L${q.x} ${q.y}`)).join(" ");
const toCore = (a: Pt[]) => a.map((p) => `M${p.x} ${p.y} Q${(p.x + CORE.x) / 2} ${p.y * 0.6 + CORE.y * 0.4} ${CORE.x} ${CORE.y}`);

const SIDES = [LEFT, RIGHT];

/** The network the robot lives in. Layers light up one after another as the stages progress. */
export default function NeuralField({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const outer = useTransform(progress, [0, 0.2, 0.4], [0.08, 0.3, 0.45]);
  const mid = useTransform(progress, [0.1, 0.4, 0.6], [0.05, 0.3, 0.5]);
  const inner = useTransform(progress, [0.3, 0.6, 0.8], [0.05, 0.35, 0.65]);
  const core = useTransform(progress, [0.5, 0.85], [0.05, 0.8]);
  const nodes = useTransform(progress, [0, 1], [0.35, 1]);
  const drift = useTransform(progress, [0, 1], [30, -50]);

  return (
    <motion.svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden className="absolute inset-0 h-full w-full" style={{ y: drift }}>
      {SIDES.map((s, side) => (
        <g key={side} stroke="rgb(var(--accent))" fill="none" strokeWidth="1">
          <motion.path d={links(s[0], s[1])} style={{ opacity: outer }} />
          <motion.path d={links(s[1], s[2])} style={{ opacity: mid }} />
          {toCore(s[2]).map((d, i) => (
            <motion.path key={i} d={d} style={{ opacity: inner }} strokeWidth="1.2" />
          ))}
          <motion.g style={{ opacity: nodes }} fill="rgb(var(--bg))" strokeWidth="1.4">
            {s.flat().map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={i % 4 === 0 ? 5 : 3.5} />
            ))}
          </motion.g>
          {!reduce &&
            toCore(s[2]).map((d, i) => (
              <motion.circle key={`pk${i}`} r="2.6" fill="rgb(var(--accent-2))" style={{ opacity: core }}>
                <animateMotion dur={`${3.2 + (i % 3) * 0.7}s`} begin={`${i * 0.6}s`} repeatCount="indefinite" path={d} />
              </motion.circle>
            ))}
        </g>
      ))}
    </motion.svg>
  );
}
