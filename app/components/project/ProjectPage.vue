<script setup lang="ts">
import { shallowRef } from "vue";
import { getProjectImages } from "@/lib/projects";
import type { Project, ProjectImage } from "@/lib/projects";
import { siteUrl } from "@/lib/site";
import ProjectBlocks from "./ProjectBlocks.vue";
import ProjectHero from "./ProjectHero.vue";
import ProjectImageViewer from "./ProjectImageViewer.vue";
import ProjectMedia from "./ProjectMedia.vue";

const { project } = defineProps<{
   project: Project;
}>();

const title = project.seo?.title ?? project.name;
const description = project.seo?.description ?? project.description;
const projectPath = `/work/${project.slug}`;
const projectUrl = new URL(projectPath, siteUrl).href;
const images = getProjectImages(project);
const viewerIndex = shallowRef<number>();

function openImage(image: ProjectImage) {
   const sameImage = images.indexOf(image);
   const position = sameImage === -1 ? images.findIndex(({ src }) => src === image.src) : sameImage;
   if (position !== -1) viewerIndex.value = position;
}

provideProjectGallery(openImage);

const coverUrl = project.cover.kind === "image" ? new URL(project.cover.src, siteUrl).href : undefined;

usePageSeo({
   title,
   description,
   label: "Case study",
   image: project.cover.kind === "image" ? project.cover : undefined,
});

useSchemaOrg([
   defineBreadcrumb({
      itemListElement: [
         { name: "Home", item: "/" },
         { name: "Work", item: "/work" },
         { name: project.name, item: projectPath },
      ],
   }),
   {
      "@type": "CreativeWork",
      name: project.name,
      description,
      url: projectUrl,
      image: coverUrl,
      genre: [...project.categories],
      creator: { "@id": `${siteUrl}/#identity` },
   },
]);
</script>

<template>
   <article class="project-page">
      <ProjectHero
         :name="project.name"
         :description="project.description"
         :categories="project.categories"
         :live-url="project.liveUrl"
      />
      <div class="section-gutter">
         <ProjectMedia :media="project.cover" loading="eager" />
      </div>
      <ProjectBlocks :blocks="project.blocks" />
      <ProjectImageViewer v-model:index="viewerIndex" :images="images" />
   </article>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.project-page {
   @apply pb-25;
}
</style>
