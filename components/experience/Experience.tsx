"use client";

import { Navigator } from "./Navigator";
import SiteNav from "./SiteNav";
import Prologue from "./Prologue";
import ResearchScene from "./ResearchScene";
import ProgrammingScene from "./ProgrammingScene";
import { Bridge, Contact, Experience as ExperienceSection, Journey, Papers, Projects, Studies, Toolkit } from "./Sections";

/** The whole portfolio: one scroll, two worlds. */
export default function Experience() {
  return (
    <Navigator>
      <SiteNav />
      <main id="main">
        <Prologue />
        <ResearchScene />
        <Studies />
        <Papers />
        <Journey />
        <Bridge />
        <ProgrammingScene />
        <Projects />
        <Toolkit />
        <ExperienceSection />
        <Contact />
      </main>
    </Navigator>
  );
}
