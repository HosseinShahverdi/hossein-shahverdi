"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "default" | "hover" | "label";
const SIZE: Record<Variant, number> = { default: 30, hover: 56, label: 84 };

/**
 * Dot + trailing ring. Grows over interactive elements; shows a label when the
 * element has data-cursor-label. Disabled on touch and with reduced motion.
 */
export default function Cursor() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 420, damping: 36, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const evaluate = (el: Element | null) => {
      const target = el?.closest?.(
        "[data-cursor-label], a, button, [role='button'], input, textarea, select, label",
      );
      if (!target) return setVariant("default");
      const l = target.getAttribute("data-cursor-label");
      if (l) {
        setLabel(l);
        setVariant("label");
      } else setVariant("hover");
    };
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      evaluate(e.target as Element | null);
    };
    // Content moves under a still pointer while scrolling
    const onScroll = () => evaluate(document.elementFromPoint(x.get(), y.get()));
    const onLeave = () => setVisible(false);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  useEffect(() => {
    setVariant("default");
  }, [pathname]);

  if (!enabled) return null;
  const size = SIZE[variant];

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[120] h-1.5 w-1.5 rounded-full bg-accent"
        style={{ x, y, translateX: "-50%", translateY: "-50%", opacity: visible && variant !== "label" ? 1 : 0 }}
      />
      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[120] flex items-center justify-center rounded-full border transition-[background-color,border-color,opacity] duration-300",
          variant === "label" && "border-transparent bg-accent",
          variant === "hover" && "border-accent/70 bg-accent/10",
          variant === "default" && "border-white/30 bg-transparent",
          visible ? "opacity-100" : "opacity-0",
        )}
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: size, height: size, scale: down ? 0.85 : 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        {variant === "label" && (
          <span className="text-[11px] font-semibold text-black">{label}</span>
        )}
      </motion.div>
    </>
  );
}
