"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Signal = { a: number; b: number; t: number; speed: number };

/**
 * Drifting neural graph: nodes connect when close, the pointer gently pulls
 * them in, and "signals" fire along edges. Pauses when the tab is hidden and
 * renders a single still frame under reduced motion.
 */
export default function NeuralBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINK = 140;
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let signals: Signal[] = [];
    let raf = 0;
    let last = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(120, Math.max(40, (w * h) / 15000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.6,
      }));
      signals = [];
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!reduce) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 220 && d > 1) {
            n.vx += (dx / d) * 0.006;
            n.vy += (dy / d) * 0.006;
          }
          n.vx *= 0.995;
          n.vy *= 0.995;
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20;
          if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          if (n.y > h + 20) n.y = -20;
        }
      }

      const neighbours: number[][] = nodes.map(() => []);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            neighbours[i].push(j);
            neighbours[j].push(i);
            const near = Math.hypot(mouse.x - (a.x + b.x) / 2, mouse.y - (a.y + b.y) / 2) < 180;
            ctx.strokeStyle = near
              ? `rgba(125, 211, 252, ${(1 - d / LINK) * 0.55})`
              : `rgba(167, 139, 250, ${(1 - d / LINK) * 0.34})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = "rgba(196, 181, 253, 0.8)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce) {
        if (t - last > 280 && signals.length < 14) {
          last = t;
          const a = Math.floor(Math.random() * nodes.length);
          const nb = neighbours[a];
          if (nb?.length) signals.push({ a, b: nb[Math.floor(Math.random() * nb.length)], t: 0, speed: 0.012 + Math.random() * 0.012 });
        }
        signals = signals.filter((s) => {
          s.t += s.speed;
          if (s.t >= 1) return false;
          const a = nodes[s.a];
          const b = nodes[s.b];
          const x = a.x + (b.x - a.x) * s.t;
          const y = a.y + (b.y - a.y) * s.t;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 10);
          g.addColorStop(0, "rgba(186, 230, 253, 0.95)");
          g.addColorStop(1, "rgba(186, 230, 253, 0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fill();
          return true;
        });
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="mesh-blob left-[-10%] top-[-10%] h-[55vh] w-[55vw] animate-float bg-[#4c1d95]" />
      <div
        className="mesh-blob bottom-[-15%] right-[-10%] h-[60vh] w-[50vw] animate-float bg-[#1e3a8a]"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="mesh-blob left-[35%] top-[40%] h-[35vh] w-[35vw] animate-float bg-[#6d28d9] opacity-25"
        style={{ animationDelay: "-12s" }}
      />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(8_6_26/0.85)_100%)]" />
    </div>
  );
}
