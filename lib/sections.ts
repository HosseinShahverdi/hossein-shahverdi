/** Every scroll anchor on the page, in document order. The element with the same id must exist in the DOM. */
export type World = "home" | "research" | "programming";

export const SECTIONS = [
  { id: "top", world: "home" },
  { id: "research", world: "research" },
  { id: "studies", world: "research" },
  { id: "papers", world: "research" },
  { id: "journey", world: "research" },
  { id: "programming", world: "programming" },
  { id: "projects", world: "programming" },
  { id: "toolkit", world: "programming" },
  { id: "experience", world: "programming" },
  { id: "contact", world: "home" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const WORLD_OF = Object.fromEntries(SECTIONS.map((s) => [s.id, s.world])) as Record<SectionId, World>;

/** Which dots the progress rail shows for each world. */
export const RAIL: Record<World, SectionId[]> = {
  home: ["top", "research", "programming", "contact"],
  research: ["research", "studies", "papers", "journey", "contact"],
  programming: ["programming", "projects", "toolkit", "experience", "contact"],
};
