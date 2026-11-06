"use client";

import { useEffect } from "react";

/** Static-export friendly redirect: replaces the history entry, with a plain link as fallback. */
export default function Redirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return (
    <p className="grid min-h-screen place-items-center text-zinc-400">
      <a href={to} className="underline">
        Continue
      </a>
    </p>
  );
}
