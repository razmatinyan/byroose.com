<script setup lang="ts">
import type { Project } from "@/lib/projects";
import { siteUrl } from "@/lib/site";
import ProjectBlocks from "./ProjectBlocks.vue";
import ProjectHero from "./ProjectHero.vue";
import ProjectMedia from "./ProjectMedia.vue";

const { project } = defineProps<{
   project: Project;
}>();

const description = project.seo?.description ?? project.description;
const projectPath = `/work/${project.slug}`;
const projectUrl = new URL(projectPath, siteUrl).href;
const coverUrl = project.cover.kind === "image" ? new URL(project.cover.src, siteUrl).href : undefined;

usePageSeo({
   title: project.name,
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
         <ProjectMedia :media="project.cover" loading="eager" sizes="100vw" />
      </div>
      <ProjectBlocks :blocks="project.blocks" />
   </article>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.project-page {
   @apply pb-25;
}
</style>
