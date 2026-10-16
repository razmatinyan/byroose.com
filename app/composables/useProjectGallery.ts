import { inject, provide } from "vue";
import type { InjectionKey } from "vue";
import type { ProjectImage } from "@/lib/projects";

type OpenProjectImage = (image: ProjectImage) => void;

const projectGalleryKey: InjectionKey<OpenProjectImage> = Symbol("project-gallery");

export function provideProjectGallery(openImage: OpenProjectImage) {
   provide(projectGalleryKey, openImage);
}

export function useProjectGallery() {
   return inject(projectGalleryKey, undefined);
}
