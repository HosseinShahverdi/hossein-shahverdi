"use client";

import { useEffect } from "react";
import Nav, { type NavSection } from "./Nav";
import Footer from "./Footer";

export type WorldName = "engineering" | "research";

/** Sets the world tokens (accent, background) and wraps the page in nav + footer. */
export default function WorldShell({
  world,
  sections,
  children,
}: {
  world: WorldName;
  sections: NavSection[];
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.dataset.world = world;
  }, [world]);

  return (
    <div data-world={world} className="relative isolate min-h-screen bg-base">
      <Nav world={world} sections={sections} />
      <main id="main">{children}</main>
      <Footer world={world} />
    </div>
  );
}
