import { inject, provide } from "vue";
import type { InjectionKey } from "vue";
import type { ProjectMedia } from "@/lib/projects";

export interface ProjectGallery {
   open: (media: ProjectMedia) => void;
   showVideoHint: () => void;
   hideVideoHint: () => void;
}

const projectGalleryKey: InjectionKey<ProjectGallery> = Symbol("project-gallery");

export function provideProjectGallery(gallery: ProjectGallery) {
   provide(projectGalleryKey, gallery);
}

export function useProjectGallery() {
   return inject(projectGalleryKey, undefined);
}
