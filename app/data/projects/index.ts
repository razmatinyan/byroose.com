import type { Project } from "@/lib/projects";
import sygen from "./sygen";
import zeelAiStudio from "./zeel-ai-studio";

export const projects: readonly Project[] = [zeelAiStudio, sygen];

export function getNextProject({ slug }: Project): Project | undefined {
   const index = projects.findIndex((project) => project.slug === slug);
   if (index === -1 || projects.length < 2) return undefined;

   return projects[(index + 1) % projects.length];
}
