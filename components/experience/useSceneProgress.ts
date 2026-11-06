"use client";

import { useEffect, type RefObject } from "react";
import { useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";

/**
 * Scroll progress (0..1) of a tall section, from its top reaching the viewport top
 * to its bottom reaching the viewport bottom.
 *
 * The value is mirrored into a plain motion value on purpose: derived opacity can otherwise be handed to the
 * browser's native scroll timeline, which does not understand this offset for pinned (sticky) scenes.
 */
export function useSceneProgress(ref: RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => progress.set(v));
  useEffect(() => progress.set(scrollYProgress.get()), [progress, scrollYProgress]);
  return progress;
}
