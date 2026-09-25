import type { Metadata } from "next";
import WorldShell from "@/components/layout/WorldShell";
import SectionHeader from "@/components/layout/SectionHeader";
import NeuralBackground from "@/components/research/NeuralBackground";
import ResearchHero from "@/components/research/Hero";
import Publications from "@/components/research/Publications";
import Lab from "@/components/research/Lab";
import AISkills from "@/components/research/AISkills";
import ResearchContact from "@/components/research/ResearchContact";
import ProjectShowcase from "@/components/showcase/ProjectShowcase";
import Timeline from "@/components/showcase/Timeline";
import { researchProjects, researchTimeline } from "@/lib/data";

export const metadata: Metadata = {
  title: "Research",
  description: "AI research by Hossein Shahverdi: lightweight Transformers, MRI synthesis and explainable AI.",
};

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "research", label: "Research" },
  { id: "papers", label: "Papers" },
  { id: "lab", label: "Lab" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

export default function ResearchPage() {
  return (
    <WorldShell world="research" sections={SECTIONS}>
      <NeuralBackground />
      <ResearchHero />
      <section id="research" className="relative py-28 sm:py-36">
        <div className="container-x">
          <SectionHeader
            variant="research"
            title="Selected research"
            description="From Wi-Fi signals to MRI volumes: the projects behind the papers."
          />
          <ProjectShowcase projects={researchProjects} variant="research" />
        </div>
      </section>
      <Publications />
      <Lab />
      <AISkills />
      <section id="journey" className="relative py-28 sm:py-36">
        <div className="container-x">
          <SectionHeader variant="research" title="The journey so far" />
          <Timeline items={researchTimeline} variant="research" />
        </div>
      </section>
      <ResearchContact />
    </WorldShell>
  );
}
