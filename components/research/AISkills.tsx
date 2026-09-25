import { aiSkills, type Tier } from "@/lib/data";
import SectionHeader from "@/components/layout/SectionHeader";
import { Reveal } from "@/components/core/Reveal";
import { cn } from "@/lib/utils";

const DOTS: Record<Tier, number> = { core: 3, strong: 2, learning: 1 };

export default function AISkills() {
  return (
    <section id="methods" className="relative py-28 sm:py-36">
      <div className="container-x">
        <SectionHeader
          variant="research"
          title="Methods and tools"
          description="Three dots means I use it every week; one means I'm actively learning it."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {aiSkills.map((g, gi) => (
            <Reveal key={g.group} delay={gi * 0.1}>
              <div className="glass h-full rounded-[28px] p-7">
                <h3 className="font-serif text-3xl text-white">{g.group}</h3>
                <ul className="mt-6 divide-y divide-white/[0.07]">
                  {g.items.map((s) => (
                    <li key={s.name} className="flex items-center justify-between py-3 text-[15px] text-zinc-200">
                      {s.name}
                      <span className="flex gap-1" aria-label={`${DOTS[s.tier]} of 3`}>
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className={cn(
                              "h-2 w-2 rounded-full",
                              d < DOTS[s.tier] ? "bg-accent shadow-[0_0_8px_rgb(var(--accent)/0.8)]" : "bg-white/10",
                            )}
                          />
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
