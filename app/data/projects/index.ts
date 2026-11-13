import type { Project } from "../../lib/projects";
import cartoon from "./cartoon";
import sygen from "./sygen";
import ugcCreator from "./ugc-creator";

export const projects: readonly Project[] = [ugcCreator, sygen, cartoon];

export function getNextProject({ slug }: Project): Project | undefined {
   const index = projects.findIndex((project) => project.slug === slug);
   if (index === -1 || projects.length < 2) return undefined;

   return projects[(index + 1) % projects.length];
}
