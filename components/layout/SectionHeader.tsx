import { SplitWords, Reveal } from "@/components/core/Reveal";
import { cn } from "@/lib/utils";

/** Engineering headings use the wide display face; research headings use the serif. */
export default function SectionHeader({
  title,
  description,
  variant = "engineering",
  aside,
  className,
}: {
  title: string;
  description?: string;
  variant?: "engineering" | "research";
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        <h2
          className={
            variant === "engineering"
              ? "hyphens-auto break-words font-display text-[clamp(2rem,5.4vw,4.4rem)] font-bold leading-[1] tracking-tight text-white"
              : "hyphens-auto break-words font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] text-white"
          }
        >
          <SplitWords text={title} />
        </h2>
        {description && (
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">{description}</p>
          </Reveal>
        )}
      </div>
      {aside && <Reveal delay={0.2}>{aside}</Reveal>}
    </div>
  );
}
