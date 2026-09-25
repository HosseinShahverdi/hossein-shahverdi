"use client";

import { MotionConfig } from "framer-motion";
import { IntroProvider } from "./IntroProvider";
import { TransitionProvider } from "./TransitionProvider";
import Loader from "./Loader";
import Cursor from "./Cursor";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <IntroProvider>
        <TransitionProvider>
          <Loader />
          <Cursor />
          {children}
          <div
            aria-hidden
            className="noise pointer-events-none fixed inset-0 z-[90] opacity-[0.04] mix-blend-overlay"
          />
        </TransitionProvider>
      </IntroProvider>
    </MotionConfig>
  );
}
