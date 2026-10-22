import type { SurfaceTone } from "@/lib/surfaces";

export type ProjectService = "ai-content" | "website-development";

export type ProjectCategory =
   | "Development"
   | "E-commerce"
   | "Imagery"
   | "Reels"
   | "UI/UX Design"
   | "Video"
   | "Web Design"
   | "Web Development";

export const projectCategoryServices: Readonly<Record<ProjectCategory, ProjectService>> = {
   Development: "website-development",
   "E-commerce": "website-development",
   Imagery: "ai-content",
   Reels: "ai-content",
   "UI/UX Design": "website-development",
   Video: "ai-content",
   "Web Design": "website-development",
   "Web Development": "website-development",
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

export interface ProjectCoverVideo extends ProjectVideo {
   poster: string;
}

export type ProjectMedia = ProjectImage | ProjectVideo;

export type ProjectCover = ProjectImage | ProjectCoverVideo;

export interface ProjectTextBlock {
   type: "text";
   title?: string;
   paragraphs: readonly string[];
   align?: "left" | "center" | "right";
}

export interface ProjectTitleBlock {
   type: "title";
   title: string;
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

export type ProjectBlock =
   | ProjectTextBlock
   | ProjectTitleBlock
   | ProjectMediaBlock
   | ProjectGridBlock
   | ProjectResultsBlock;

export interface ProjectSurface {
   color: string;
   ink: "dark" | "light";
}

export interface Project {
   slug: string;
   name: string;
   description: string;
   categories: readonly ProjectCategory[];
   liveUrl?: string;
   surface: ProjectSurface;
   cover: ProjectCover;
   blocks: readonly ProjectBlock[];
   seo?: {
      title?: string;
      description?: string;
   };
}

export function defineProject(project: Project): Project {
   return project;
}

export function getProjectCoverImage({ cover }: Project): ProjectImage {
   if (cover.kind === "image") return cover;

   const { poster, width, height, alt } = cover;
   return { kind: "image", src: poster, width, height, alt };
}

export function getProjectImages({ cover, blocks }: Project): ProjectImage[] {
   const images: ProjectImage[] = cover.kind === "image" ? [cover] : [];

   for (const block of blocks) {
      if (block.type === "media" && block.media.kind === "image") images.push(block.media);
      if (block.type === "grid") images.push(...block.images);
   }

   return images;
}
