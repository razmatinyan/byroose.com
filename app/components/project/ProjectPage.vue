<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from "vue";
import { getProjectCoverImage, getProjectGallery } from "@/lib/projects";
import type { Project, ProjectMedia as ProjectMediaItem } from "@/lib/projects";
import { siteUrl } from "@/lib/site";
import ProjectBlocks from "./ProjectBlocks.vue";
import ProjectHero from "./ProjectHero.vue";
import ProjectImageViewer from "./ProjectImageViewer.vue";
import ProjectMedia from "./ProjectMedia.vue";
import ProjectNext from "./ProjectNext.vue";

const belowFoldHydrationArea = { rootMargin: "100% 0px" };

const TrailingTooltip = defineAsyncComponent(
   () => import("@/components/shared/TrailingTooltip.vue"),
);

const { project, nextProject } = defineProps<{
   project: Project;
   nextProject?: Project;
}>();

const title = project.seo?.title ?? project.name;
const description = project.seo?.description ?? project.description;
const projectPath = `/work/${project.slug}`;
const projectUrl = new URL(projectPath, siteUrl).href;
const galleryItems = getProjectGallery(project);
const viewerIndex = shallowRef<number>();
const videoHintLabel = "Watch with sound";

const {
   active: videoHintActive,
   hide: hideVideoHint,
   shouldLoad: shouldLoadVideoHint,
   show: showTooltip,
} = useTrailingTooltip();

function openMedia(media: ProjectMediaItem) {
   const sameItem = galleryItems.indexOf(media);
   const position =
      sameItem === -1 ? galleryItems.findIndex(({ src }) => src === media.src) : sameItem;
   if (position === -1) return;

   hideVideoHint();
   viewerIndex.value = position;
}

function showVideoHint() {
   showTooltip("", videoHintLabel, "default", true);
}

provideProjectGallery({ open: openMedia, showVideoHint, hideVideoHint });

const coverImage = getProjectCoverImage(project);
const coverUrl = new URL(coverImage.src, siteUrl).href;

usePageSeo({
   title,
   description,
   label: "Case study",
   image: coverImage,
   type: "article",
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
   <article class="project-page" :data-next-project="nextProject ? '' : undefined">
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
      <ProjectNext v-if="nextProject" :project="nextProject" />
      <LazySharedPricingSection
         class="py-section"
         :clear-curve="false"
         :hydrate-on-visible="belowFoldHydrationArea"
      />
      <ProjectImageViewer v-model:index="viewerIndex" :items="galleryItems" />
      <TrailingTooltip
         v-if="shouldLoadVideoHint"
         :active="videoHintActive"
         mark
         :label="videoHintLabel"
      />
   </article>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.project-page:not([data-next-project]) {
   @apply pb-25;
}
</style>
