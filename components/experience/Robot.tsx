"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";

/** One identity colour per research stage: AI, ML, DL, Medical, Science. The ring on the face takes this colour. */
export const STAGE_COLORS = ["#4d7cff", "#22d3ee", "#a78bfa", "#5eead4", "#fcd34d"];
const STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];
const COLOR_STOPS = [STAGE_COLORS[0], STAGE_COLORS[1], STAGE_COLORS[2], STAGE_COLORS[3], STAGE_COLORS[4], STAGE_COLORS[4]];

/** Centre and radius of the glowing ring on the face (SVG units). */
const RING = { x: 292, y: 256, r: 64 };

type Props = {
  /** 0..1 scene progress: the ring ignites as the scene starts, then changes colour per stage. */
  progress: MotionValue<number>;
  label: string;
  className?: string;
  /** Follows the pointer and reacts to a click / Enter / Space. */
  interactive?: boolean;
  cursorLabel?: string;
};

/**
 * A faceless black android in a hooded jacket, with a single glowing ring where a face would be.
 * Pure SVG, one motion layer per body part (head, hood, collar, side sensor, ring).
 * Interactive mode: the head and ring follow the pointer; a click sends a pulse out of the ring.
 */
export default function Robot({ progress, label, className, interactive = false, cursorLabel }: Props) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  // pointer position relative to the window, -1..1
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.6 });
  // click response
  const burst = useMotionValue(0);
  const wave = useMotionValue(0);
  const spin = useMotionValue(0);

  useEffect(() => {
    if (!interactive || reduce) return;
    const move = (e: PointerEvent) => {
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.28;
      px.set(Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.45))));
      py.set(Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.45))));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [interactive, reduce, px, py]);

  const trigger = () => {
    if (reduce) return;
    animate(burst, [0, 1, 0], { duration: 1.2, times: [0, 0.2, 1], ease: "easeOut" });
    wave.set(0);
    animate(wave, 1, { duration: 1.5, ease: [0.22, 1, 0.36, 1] });
    animate(spin, spin.get() + 360, { duration: 1.2, ease: [0.22, 1, 0.36, 1] });
  };

  // scene-driven
  const light = useTransform(progress, STOPS, COLOR_STOPS);
  const ignite = useTransform(progress, [0.04, 0.2], [0.12, 1]); // the ring switches on
  const stageTilt = useTransform(progress, STOPS, [0, -2, 3, -2, 2, 0]);
  const headRise = useTransform(progress, [0, 0.12], [36, 0]);
  const hoodRise = useTransform(progress, [0, 0.12], [22, 0]);
  const bodyRise = useTransform(progress, [0, 0.12], [12, 0]);
  const backlight = useTransform(progress, [0, 0.5, 1], [0.25, 0.4, 0.55]);

  // pointer-driven, each layer at its own depth
  const headRot = useTransform([stageTilt, sx] as MotionValue<number>[], ([t, x]: number[]) => t + x * 7);
  const headX = useTransform(sx, [-1, 1], [-12, 12]);
  const headY = useTransform([sy, headRise, burst] as MotionValue<number>[], ([y, r, b]: number[]) => y * 6 + r - b * 10);
  const hoodX = useTransform(sx, [-1, 1], [5, -5]);
  const hoodY = useTransform([hoodRise, burst] as MotionValue<number>[], ([r, b]: number[]) => r + b * 4);
  const collarY = useTransform([bodyRise, burst] as MotionValue<number>[], ([r, b]: number[]) => r + b * 6);
  const sensorX = useTransform(sx, [-1, 1], [-22, 16]);
  const sensorScale = useTransform(sx, [-1, 1], [1.1, 0.7]);
  // the ring is "painted" on curved glass: it slides and squashes as the head turns
  const ringX = useTransform(sx, [-1, 1], [-26, 26]);
  const ringY = useTransform(sy, [-1, 1], [-12, 14]);
  const ringSquash = useTransform(sx, (v) => 1 - Math.abs(v) * 0.16);
  const ringPop = useTransform(burst, [0, 1], [1, 1.14]);
  const glowStrength = useTransform([ignite, burst] as MotionValue<number>[], ([i, b]: number[]) => i * (0.75 + b * 0.5));
  const fillGlow = useTransform(glowStrength, (v) => v * 0.1);
  const coreOpacity = useTransform(ignite, [0, 1], [0.35, 1]);
  const waveR = useTransform(wave, [0, 1], [RING.r, 330]);
  const waveO = useTransform(wave, [0, 0.08, 1], [0, 0.9, 0]);

  const svg = (
    <svg
      viewBox="0 0 600 780"
      role="img"
      aria-label={label}
      className={className}
      overflow="visible"
      style={{ maskImage: "linear-gradient(to bottom, #000 74%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 74%, transparent 100%)" }}
    >
      <defs>
        <linearGradient id="rb-helmet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#263343" />
          <stop offset=".25" stopColor="#080d16" />
          <stop offset=".62" stopColor="#000207" />
          <stop offset="1" stopColor="#17212e" />
        </linearGradient>
        <linearGradient id="rb-hood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#202a36" />
          <stop offset=".35" stopColor="#080d14" />
          <stop offset="1" stopColor="#020407" />
        </linearGradient>
        <linearGradient id="rb-fabric" x1="0" y1="0" x2=".85" y2="1">
          <stop offset="0" stopColor="#17212c" />
          <stop offset=".5" stopColor="#090e15" />
          <stop offset="1" stopColor="#030609" />
        </linearGradient>
        <radialGradient id="rb-lens">
          <stop offset="0" stopColor="#263747" />
          <stop offset=".38" stopColor="#080e17" />
          <stop offset=".78" stopColor="#000" />
          <stop offset="1" stopColor="#536476" />
        </radialGradient>
        <linearGradient id="rb-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6f2ff" stopOpacity=".9" />
          <stop offset=".45" stopColor="#9db2c8" stopOpacity=".18" />
          <stop offset="1" stopColor="#dbeaff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="rb-back" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#4d7cff" stopOpacity=".5" />
          <stop offset="1" stopColor="#4d7cff" stopOpacity="0" />
        </radialGradient>
        <clipPath id="rb-helm-clip">
          <path d="M120 116 C147 58 220 26 300 25 C391 24 463 69 489 143 C507 194 501 269 485 331 C473 379 446 420 401 448 C363 472 307 481 251 464 C198 448 151 414 126 369 C105 332 91 259 94 205 C96 169 103 139 120 116Z" />
        </clipPath>
        <filter id="rb-softGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="rb-tightGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      {/* cool backlight so the black can read against the scene */}
      <motion.circle cx="300" cy="250" r="330" fill="url(#rb-back)" style={{ opacity: backlight }} />

      <g className="robot-float">
        {/* body */}
        <motion.g id="body" style={{ y: collarY }}>
          <path d="M185 475 C145 494 105 525 72 570 C37 618 18 690 0 900 H600 L600 620 C559 588 519 555 476 528 C440 505 403 486 365 476 Z" fill="url(#rb-fabric)" stroke="#182330" strokeWidth="4" />
          <path d="M178 532 C123 578 91 654 75 900 M424 523 C488 585 533 683 552 900" fill="none" stroke="#273442" strokeWidth="3" opacity=".65" />
          <path d="M58 690 C112 657 155 646 205 650 M405 649 C462 646 511 671 565 711" fill="none" stroke="#111b27" strokeWidth="5" opacity=".8" />
        </motion.g>

        {/* neck */}
        <motion.g id="neck" style={{ y: collarY }}>
          <path d="M224 390 L218 497 Q293 545 379 494 L367 382 Z" fill="#03070c" stroke="#273442" strokeWidth="4" />
          <path d="M241 421 Q294 453 355 418" fill="none" stroke="#334253" strokeWidth="3" opacity=".65" />
        </motion.g>

        {/* hood */}
        <motion.g id="hood" style={{ x: hoodX, y: hoodY }}>
          <path
            d="M180 448 Q145 459 128 500 L91 577 Q135 620 193 627 L240 543 Q286 579 346 558 Q391 543 426 576 L492 632 Q543 603 574 555 L549 488 Q526 447 475 438 L396 420 Q353 470 289 474 Q226 473 180 448Z"
            fill="url(#rb-hood)"
            stroke="#263442"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path d="M176 470 Q149 505 143 550 M432 462 Q473 484 491 535" fill="none" stroke="#39495a" strokeWidth="3" opacity=".55" />
          <path d="M183 480 Q221 530 244 570 M421 474 Q391 520 365 556" fill="none" stroke="#020509" strokeWidth="12" opacity=".85" />
          <path d="M246 543 Q293 581 348 558" fill="none" stroke="#4b5a68" strokeWidth="2" opacity=".45" />
        </motion.g>

        {/* collar: the inner collar picks up the ring's colour as a faint light */}
        <motion.g id="collar" style={{ y: collarY }}>
          <path d="M214 500 Q251 546 292 552 Q337 552 372 504 L393 538 Q355 599 293 608 Q227 594 192 548Z" fill="#03070c" />
          <path d="M236 520 Q259 559 294 565 Q330 560 352 522 L363 544 Q338 585 295 588 Q252 581 225 544Z" fill="#e8edf0" />
          <motion.path d="M231 523 Q258 567 295 573 Q331 568 356 526" fill="none" stroke={light} strokeWidth="3" style={{ opacity: coreOpacity }} />
        </motion.g>

        {/* head */}
        <motion.g id="head" style={{ rotate: headRot, x: headX, y: headY, originX: 0.5, originY: 0.9 }}>
          <path
            d="M120 116 C147 58 220 26 300 25 C391 24 463 69 489 143 C507 194 501 269 485 331 C473 379 446 420 401 448 C363 472 307 481 251 464 C198 448 151 414 126 369 C105 332 91 259 94 205 C96 169 103 139 120 116Z"
            fill="url(#rb-helmet)"
            stroke="#344253"
            strokeWidth="5"
          />
          <path d="M119 169 C143 89 221 47 302 48 C373 48 431 77 460 127 C418 100 366 88 315 91 C236 94 171 125 119 169Z" fill="url(#rb-shine)" opacity=".72" />
          <path d="M125 198 C162 132 244 100 321 105 C389 108 438 132 469 171 C447 139 396 125 347 126 C264 128 187 157 125 220Z" fill="#a8bfd5" opacity=".12" />
          <path d="M105 237 Q99 331 145 390 Q171 423 217 444" fill="none" stroke="#526477" strokeWidth="4" opacity=".45" />
          <path d="M155 398 Q220 466 307 465 Q382 464 431 418" fill="none" stroke="#000" strokeWidth="9" opacity=".7" />
          <path d="M170 88 Q235 39 315 43 Q391 46 431 91 Q386 67 322 70 Q237 72 170 112Z" fill="#d7e7f7" opacity=".26" />

          {/* the glowing ring, centre of the face */}
          <g clipPath="url(#rb-helm-clip)">
            <motion.g style={{ x: ringX, y: ringY, scaleX: ringSquash, scale: ringPop, originX: `${RING.x}px`, originY: `${RING.y}px` }}>
              <motion.circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke={light} strokeWidth="30" filter="url(#rb-softGlow)" style={{ opacity: glowStrength }} />
              <motion.circle cx={RING.x} cy={RING.y} r={RING.r - 6} fill={light} filter="url(#rb-softGlow)" style={{ opacity: fillGlow }} />
              <motion.circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke={light} strokeWidth="11" filter="url(#rb-tightGlow)" style={{ opacity: coreOpacity }} />
              <motion.circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke={light} strokeWidth="9" style={{ opacity: coreOpacity }} />
              <circle cx={RING.x} cy={RING.y} r={RING.r} fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="2.5" className="robot-pulse" />
            </motion.g>
          </g>
        </motion.g>

        {/* click shockwave leaves the ring */}
        <motion.circle cx={RING.x} cy={RING.y} fill="none" stroke={light} strokeWidth="2.5" style={{ r: waveR, opacity: waveO }} />

        {/* side sensor */}
        <motion.g id="sensor" style={{ x: sensorX, scaleX: sensorScale, y: headY, originX: "470px", originY: "286px" }}>
          <path d="M430 229 Q466 201 493 225 Q514 247 505 292 Q496 333 463 349 L432 326 Q447 291 430 229Z" fill="#03070d" stroke="#354455" strokeWidth="4" />
          <path d="M441 239 Q468 215 489 236" fill="none" stroke="#d5e2ef" strokeWidth="5" strokeLinecap="round" />
          <path d="M438 257 Q460 233 486 251" fill="none" stroke="#9eafc1" strokeWidth="3" strokeLinecap="round" />
          <circle cx="470" cy="286" r="30" fill="#050a11" stroke="#647588" strokeWidth="3" />
          <circle cx="470" cy="286" r="21" fill="url(#rb-lens)" stroke="#9aabba" strokeWidth="2" />
          <motion.g style={{ rotate: spin, originX: "470px", originY: "286px" }}>
            <motion.circle cx="470" cy="286" r="15" fill="none" stroke={light} strokeWidth="2" strokeDasharray="20 14" style={{ opacity: coreOpacity }} />
          </motion.g>
          <circle cx="470" cy="286" r="9" fill="#02060b" stroke="#a9bdcf" strokeWidth="2" />
          <circle cx="467" cy="281" r="3" fill="#d7e7f5" />
          <path d="M448 316 Q465 329 485 312" fill="none" stroke="#263849" strokeWidth="3" />
        </motion.g>
      </g>
    </svg>
  );

  if (!interactive) return svg;

  return (
    <div
      ref={root}
      role="button"
      tabIndex={0}
      aria-label={label}
      data-cursor-label={cursorLabel}
      onClick={trigger}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger();
        }
      }}
      className="focus-ring pointer-events-auto h-full cursor-pointer rounded-[2rem] outline-none"
    >
      {svg}
    </div>
  );
}
