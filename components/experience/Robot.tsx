"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/** One identity colour per research stage: AI, ML, DL, Medical, Science. */
export const STAGE_COLORS = ["#a78bfa", "#7dd3fc", "#f0abfc", "#5eead4", "#fcd34d"];
const STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];
const COLOR_STOPS = [STAGE_COLORS[0], STAGE_COLORS[1], STAGE_COLORS[2], STAGE_COLORS[3], STAGE_COLORS[4], STAGE_COLORS[4]];

/**
 * The AI character. Pure SVG so it stays crisp and light.
 * `progress` (0..1) drives its attention: head tilt, gaze, held orb, aura and eye colour.
 */
export default function Robot({ progress, label, className }: { progress: MotionValue<number>; label: string; className?: string }) {
  const tilt = useTransform(progress, STOPS, [0, -5, 6, -4, 3, 0]);
  const gazeX = useTransform(progress, STOPS, [0, -5, 5, -3, 4, 0]);
  const gazeY = useTransform(progress, STOPS, [0, 1, -2, 2, -1, 0]);
  const eye = useTransform(progress, STOPS, COLOR_STOPS);
  const aura = useTransform(progress, [0, 1], [0.92, 1.3]);
  const auraOpacity = useTransform(progress, [0, 0.5, 1], [0.35, 0.55, 0.75]);
  const handY = useTransform(progress, STOPS, [0, -10, 4, -12, 2, -6]);
  const orbY = useTransform(progress, STOPS, [0, -14, -4, -18, -8, -22]);

  return (
    <svg viewBox="0 0 400 480" role="img" aria-label={label} className={className} overflow="visible">
      <defs>
        <linearGradient id="rb-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2656" />
          <stop offset="1" stopColor="#0d0b22" />
        </linearGradient>
        <linearGradient id="rb-head" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38327a" />
          <stop offset="1" stopColor="#14112e" />
        </linearGradient>
        <linearGradient id="rb-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c4b5fd" stopOpacity="0.9" />
          <stop offset="1" stopColor="#c4b5fd" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="rb-flame" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#a78bfa" stopOpacity="0.7" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
        <filter id="rb-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* aura */}
      <motion.circle cx="200" cy="250" r="190" fill="none" stroke="url(#rb-rim)" strokeWidth="1" style={{ scale: aura, opacity: auraOpacity, originX: 0.5, originY: 0.5 }} />
      <motion.circle cx="200" cy="250" r="150" fill="none" stroke="url(#rb-rim)" strokeWidth="1" strokeDasharray="2 10" style={{ scale: aura, opacity: auraOpacity, originX: 0.5, originY: 0.5 }} />

      <g className="robot-float">
        {/* thruster */}
        <ellipse cx="200" cy="438" rx="58" ry="9" fill="#a78bfa" opacity="0.28" filter="url(#rb-glow)" />
        <path className="robot-flame" d="M176 396 Q200 470 224 396 Z" fill="url(#rb-flame)" />

        {/* arms */}
        <path d="M128 240 Q92 270 86 318" stroke="#0d0b22" strokeWidth="26" strokeLinecap="round" fill="none" />
        <path d="M128 240 Q92 270 86 318" stroke="#4c43a8" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M272 240 Q308 270 314 318" stroke="#0d0b22" strokeWidth="26" strokeLinecap="round" fill="none" />
        <path d="M272 240 Q308 270 314 318" stroke="#4c43a8" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <motion.g style={{ y: handY }}>
          <circle cx="84" cy="332" r="15" fill="url(#rb-head)" stroke="#a78bfa" strokeOpacity="0.5" />
          <circle cx="316" cy="332" r="15" fill="url(#rb-head)" stroke="#a78bfa" strokeOpacity="0.5" />
          {/* data orb held by the right hand */}
          <motion.g style={{ y: orbY }}>
            <motion.circle cx="316" cy="296" r="16" fill={eye} opacity="0.5" filter="url(#rb-glow)" />
            <motion.circle cx="316" cy="296" r="8" fill={eye} />
            <circle cx="316" cy="296" r="13" fill="none" stroke="#fff" strokeOpacity="0.4" strokeDasharray="3 5" className="robot-spin" />
          </motion.g>
        </motion.g>

        {/* torso */}
        <path d="M132 238 Q132 208 162 208 H238 Q268 208 268 238 V318 Q268 370 200 396 Q132 370 132 318 Z" fill="url(#rb-body)" stroke="url(#rb-rim)" strokeWidth="1.5" />
        <path d="M156 226 H244 M150 250 H250" stroke="#a78bfa" strokeOpacity="0.18" />
        <path d="M168 346 Q200 366 232 346" stroke="#a78bfa" strokeOpacity="0.25" fill="none" />
        {/* chest core */}
        <motion.circle cx="200" cy="288" r="34" fill={eye} opacity="0.22" filter="url(#rb-glow)" className="robot-pulse" />
        <circle cx="200" cy="288" r="24" fill="#08061a" stroke="#a78bfa" strokeOpacity="0.5" />
        <circle cx="200" cy="288" r="17" fill="none" stroke="#a78bfa" strokeOpacity="0.35" strokeDasharray="4 6" className="robot-spin" />
        <motion.circle cx="200" cy="288" r="8" fill={eye} className="robot-pulse" />

        {/* neck */}
        <rect x="182" y="190" width="36" height="22" rx="8" fill="#14112e" stroke="#a78bfa" strokeOpacity="0.3" />

        {/* head */}
        <motion.g style={{ rotate: tilt, originX: 0.5, originY: 1 }}>
          <line x1="200" y1="62" x2="200" y2="34" stroke="#a78bfa" strokeOpacity="0.7" strokeWidth="2" />
          <motion.circle cx="200" cy="30" r="6" fill={eye} className="robot-pulse" />
          <rect x="98" y="108" width="14" height="46" rx="7" fill="#14112e" stroke="#a78bfa" strokeOpacity="0.5" />
          <rect x="288" y="108" width="14" height="46" rx="7" fill="#14112e" stroke="#a78bfa" strokeOpacity="0.5" />
          <rect x="118" y="62" width="164" height="136" rx="52" fill="url(#rb-head)" stroke="url(#rb-rim)" strokeWidth="1.5" />
          <rect x="138" y="100" width="124" height="58" rx="29" fill="#05030f" stroke="#a78bfa" strokeOpacity="0.35" />
          <motion.g style={{ x: gazeX, y: gazeY }}>
            <motion.ellipse cx="172" cy="129" rx="13" ry="10" fill={eye} opacity="0.35" filter="url(#rb-glow)" />
            <motion.ellipse cx="228" cy="129" rx="13" ry="10" fill={eye} opacity="0.35" filter="url(#rb-glow)" />
            <motion.ellipse cx="172" cy="129" rx="9" ry="7" fill={eye} className="robot-blink" />
            <motion.ellipse cx="228" cy="129" rx="9" ry="7" fill={eye} className="robot-blink" />
          </motion.g>
          <path d="M170 176 Q200 186 230 176" stroke="#a78bfa" strokeOpacity="0.3" fill="none" strokeLinecap="round" />
        </motion.g>
      </g>
    </svg>
  );
}
