"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type Line = { kind: "cmd" | "out"; text: string; tone?: "ok" | "warn" | "dim" };

const SCRIPT: Line[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: "hossein — ai engineer, security, full-stack" },
  { kind: "cmd", text: "nmap -sV --top-ports 3 staging.local" },
  { kind: "out", text: "22/tcp   open    ssh     key-only", tone: "ok" },
  { kind: "out", text: "443/tcp  open    https   tls 1.3", tone: "ok" },
  { kind: "out", text: "8080/tcp filtered http-alt", tone: "warn" },
  { kind: "cmd", text: "python train.py --model lite-transformer --edge" },
  { kind: "out", text: "✓ exported model.tflite (on-device, streaming)", tone: "ok" },
  { kind: "cmd", text: "git push origin main && vercel --prod" },
  { kind: "out", text: "✓ deployed", tone: "ok" },
];

/** Decorative terminal that types itself once, when visible. */
export default function Terminal({ start }: { start: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    if (!start || !inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setLines(SCRIPT);
      return;
    }
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
    (async () => {
      await sleep(700);
      for (const line of SCRIPT) {
        if (cancelled) return;
        if (line.kind === "cmd") {
          for (let c = 1; c <= line.text.length; c++) {
            if (cancelled) return;
            setTyping(line.text.slice(0, c));
            await sleep(24 + Math.random() * 40);
          }
          await sleep(220);
          setTyping("");
          setLines((l) => [...l, line]);
          await sleep(260);
        } else {
          setLines((l) => [...l, line]);
          await sleep(120);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [start, inView]);

  return (
    <div ref={ref} className="glass overflow-hidden rounded-2xl bg-black/50" aria-hidden>
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-zinc-500">~/hossein — zsh</span>
      </div>
      <div className="min-h-[330px] overflow-x-auto whitespace-pre p-5 font-mono text-[12px] leading-7 sm:text-sm">
        {lines.map((l, i) =>
          l.kind === "cmd" ? (
            <p key={i} className="whitespace-pre text-zinc-100">
              <span className="text-accent">❯ </span>
              {l.text}
            </p>
          ) : (
            <p
              key={i}
              className={
                l.tone === "ok" ? "text-emerald-300/90" : l.tone === "warn" ? "text-amber-300/90" : "text-zinc-400"
              }
            >
              {l.text}
            </p>
          ),
        )}
        <p className="text-zinc-100">
          <span className="text-accent">❯ </span>
          {typing}
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-accent" />
        </p>
      </div>
    </div>
  );
}
