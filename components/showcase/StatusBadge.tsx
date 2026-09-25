import type { Status } from "@/lib/data";
import { cn } from "@/lib/utils";

const STYLE: Record<Status, { cls: string; pulse?: boolean }> = {
  Shipped: { cls: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10" },
  Published: { cls: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10" },
  Building: { cls: "text-accent border-accent/30 bg-accent/10", pulse: true },
  Preprint: { cls: "text-amber-200 border-amber-300/30 bg-amber-300/10" },
  Concept: { cls: "text-zinc-300 border-white/15 bg-white/5" },
  Planned: { cls: "text-zinc-300 border-white/15 bg-white/5" },
};

export default function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const s = STYLE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] leading-none backdrop-blur",
        s.cls,
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {s.pulse && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {status}
    </span>
  );
}
