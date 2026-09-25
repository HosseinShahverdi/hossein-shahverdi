"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { profile } from "@/lib/data";
import { GithubIcon, LinkedinIcon } from "@/components/core/icons";
import type { WorldName } from "./WorldShell";

export default function Footer({ world }: { world: WorldName }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: profile.timezone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="container-x flex flex-col gap-6 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}.{" "}
          {world === "engineering" ? "Built with Next.js and Framer Motion." : "Research, signals and models."}
        </p>
        <p className="tabular-nums">
          {profile.location}
          {time ? `, ${time} local time` : ""}
        </p>
        <div className="flex items-center gap-2">
          <a
            href={profile.links.github}
            aria-label="GitHub"
            className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:text-white"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={profile.links.linkedin}
            aria-label="LinkedIn"
            className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:text-white"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="focus-ring ml-2 flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-zinc-300 transition-colors hover:border-accent/50 hover:text-white"
          >
            <ArrowUp size={14} /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
