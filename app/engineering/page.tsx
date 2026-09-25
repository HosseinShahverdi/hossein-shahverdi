import type { Metadata } from "next";
import WorldShell from "@/components/layout/WorldShell";
import SectionHeader from "@/components/layout/SectionHeader";
import EngineeringHero from "@/components/engineering/Hero";
import Skills from "@/components/engineering/Skills";
import Contact from "@/components/engineering/Contact";
import ProjectShowcase from "@/components/showcase/ProjectShowcase";
import Timeline from "@/components/showcase/Timeline";
import { engineeringProjects, engineeringTimeline } from "@/lib/data";

export const metadata: Metadata = {
  title: "Engineering",
  description: "Full-stack, security and AI engineering projects by Hossein Shahverdi.",
};

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "toolkit", label: "Toolkit" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function EngineeringPage() {
  return (
    <WorldShell world="engineering" sections={SECTIONS}>
      <EngineeringHero />
      <Skills />
      <section id="projects" className="relative py-28 sm:py-36">
        <div className="container-x">
          <SectionHeader
            title="Things I'm building"
            description="Web, security and AI projects. Each card shows where it stands: building, shipped, or still a concept. Open one for the details."
          />
          <ProjectShowcase projects={engineeringProjects} variant="engineering" />
        </div>
      </section>
      <section id="experience" className="relative py-28 sm:py-36">
        <div className="container-x">
          <SectionHeader title="Experience" description="Research labs, classrooms and the projects in between." />
          <Timeline items={engineeringTimeline} variant="engineering" />
        </div>
      </section>
      <Contact />
    </WorldShell>
  );
}
