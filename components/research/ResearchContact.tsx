import { Mail, GraduationCap } from "lucide-react";
import { profile, references } from "@/lib/data";
import { Magnetic } from "@/components/core/Magnetic";
import { Reveal, SplitWords } from "@/components/core/Reveal";
import { CopyEmail } from "@/components/engineering/Contact";

export default function ResearchContact() {
  return (
    <section id="contact" className="relative py-32 sm:py-44">
      <div className="container-x grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <h2 className="font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.92] text-white">
            <SplitWords text="Looking for a PhD student who ships?" />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-lg text-lg leading-[1.7] text-zinc-300/80">
              I&apos;m open to PhD positions and research collaborations in efficient, reliable and explainable deep
              learning.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
            <Magnetic strength={0.4}>
              <a
                href={`mailto:${profile.email}`}
                data-cursor-label="Write"
                className="focus-ring inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-base font-semibold text-[#0b0826] shadow-[0_0_60px_-10px_rgb(var(--accent)/0.9)]"
              >
                <Mail size={18} /> Email me
              </a>
            </Magnetic>
            <CopyEmail />
            <a
              href={profile.links.scholar}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-[15px] text-zinc-200 transition-colors hover:border-accent/50 hover:text-white"
            >
              <GraduationCap size={17} /> Google Scholar
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="glass rounded-[28px] p-7">
            <h3 className="font-serif text-3xl text-white">References</h3>
            <ul className="mt-5 divide-y divide-white/[0.07]">
              {references.map((r) => (
                <li key={r.name} className="py-4">
                  <p className="text-white">{r.name}</p>
                  <p className="text-sm text-zinc-400">
                    {r.role}, {r.org}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-zinc-500">Contact details available on request.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
