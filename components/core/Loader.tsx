"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { useIntro } from "./IntroProvider";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/utils";

const NAME = "Hossein Shahverdi";

/** First-visit intro: a counter fills while the name assembles, then the screen wipes upward. */
export default function Loader() {
  const { setReady } = useIntro();
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("hs:intro") === "1";
      sessionStorage.setItem("hs:intro", "1");
    } catch {
      /* storage unavailable: just play the intro */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      if (root.current) root.current.style.display = "none";
      setVisible(false);
      setReady(true);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const controls = animate(0, 100, {
      duration: 1.9,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        window.setTimeout(() => {
          setVisible(false);
          setReady(true);
          document.documentElement.style.overflow = "";
        }, 250);
      },
    });
    return () => {
      controls.stop();
      document.documentElement.style.overflow = "";
    };
  }, [setReady]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={root}
          role="status"
          aria-label="Loading"
          className="hs-loader fixed inset-0 z-[100] flex flex-col justify-between bg-[#040608] p-6 sm:p-10"
          style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.95, ease: EASE_IN_OUT } }}
        >
          <div className="flex justify-between text-sm text-zinc-500">
            <span>Portfolio 2026</span>
            <span className="hidden sm:inline">AI, security and full-stack</span>
          </div>

          <h2 className="font-display text-[clamp(2.4rem,9vw,7.5rem)] font-extrabold leading-none tracking-tight text-white">
            <span className="sr-only">{NAME}</span>
            <span aria-hidden className="flex flex-wrap gap-x-[0.28em]">
              {NAME.split(" ").map((word, w) => (
                <span key={word} className="inline-flex whitespace-nowrap">
                  {word.split("").map((ch, i) => (
                    <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
                      <motion.span
                        className="inline-block"
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{ delay: 0.15 + (w * 7 + i) * 0.035, duration: 0.8, ease: EASE_OUT }}
                      >
                        {ch}
                      </motion.span>
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </h2>

          <div>
            <div className="mb-4 flex items-end justify-between">
              <span className="max-w-[16rem] text-sm text-zinc-500">
                Compiling models, hardening endpoints, warming up the GPU.
              </span>
              <span className="font-display text-6xl font-extrabold tabular-nums text-[#22e3ff] sm:text-8xl">
                {String(count).padStart(3, "0")}
              </span>
            </div>
            <div className="h-px w-full bg-white/10">
              <div className="h-px bg-[#22e3ff]" style={{ width: `${count}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
