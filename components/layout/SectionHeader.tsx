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
              ? "font-display text-[clamp(2.4rem,6vw,4.75rem)] font-extrabold leading-[0.95] tracking-tight text-white"
              : "font-serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95] text-white"
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
