import type { SurfaceTone } from "@/lib/surfaces";

export type ProjectService = "ai-content" | "website-development";

export type ProjectCategory =
   | "Development"
   | "E-commerce"
   | "Imagery"
   | "Reels"
   | "Video"
   | "Web Design";

export const projectCategoryServices: Readonly<Record<ProjectCategory, ProjectService>> = {
   Development: "website-development",
   "E-commerce": "website-development",
   Imagery: "ai-content",
   Reels: "ai-content",
   Video: "ai-content",
   "Web Design": "website-development",
};

export interface ProjectImage {
   kind: "image";
   src: string;
   width: number;
   height: number;
   alt: string;
}

export interface ProjectVideo {
   kind: "video";
   src: string;
   width: number;
   height: number;
   alt: string;
   poster?: string;
}

export type ProjectMedia = ProjectImage | ProjectVideo;

export interface ProjectTextBlock {
   type: "text";
   title?: string;
   paragraphs: readonly string[];
   align?: "left" | "center" | "right";
}

export interface ProjectMediaBlock {
   type: "media";
   media: ProjectMedia;
}

export interface ProjectGridBlock {
   type: "grid";
   columns?: 2 | 3;
   images: readonly ProjectImage[];
}

export interface ProjectResult {
   value: string;
   label: string;
}

export interface ProjectResultsBlock {
   type: "results";
   tone?: Exclude<SurfaceTone, "card">;
   results: readonly ProjectResult[];
}

export type ProjectBlock = ProjectTextBlock | ProjectMediaBlock | ProjectGridBlock | ProjectResultsBlock;

export interface Project {
   slug: string;
   name: string;
   description: string;
   categories: readonly ProjectCategory[];
   liveUrl?: string;
   cover: ProjectMedia;
   blocks: readonly ProjectBlock[];
   seo?: {
      description?: string;
   };
}

export function defineProject(project: Project): Project {
   return project;
}
