<script setup lang="ts">
import type { ProjectBlock } from "@/lib/projects";
import ProjectGridBlock from "./ProjectGridBlock.vue";
import ProjectMedia from "./ProjectMedia.vue";
import ProjectResultsBlock from "./ProjectResultsBlock.vue";
import ProjectTextBlock from "./ProjectTextBlock.vue";
import ProjectTitleBlock from "./ProjectTitleBlock.vue";

const { blocks } = defineProps<{
   blocks: readonly ProjectBlock[];
}>();

const mediaBlockTypes = new Set<ProjectBlock["type"]>(["media", "grid"]);

function gapSize(index: number) {
   const block = blocks[index];
   const previous = blocks[index - 1];
   if (!block) return undefined;
   if (block.type === "title" && previous) return "section";
   if (!mediaBlockTypes.has(block.type)) return undefined;

   return !previous || mediaBlockTypes.has(previous.type) ? "close" : undefined;
}
</script>

<template>
   <section v-if="blocks.length" class="project-blocks section-gutter" aria-label="Project story">
      <template v-for="(block, index) in blocks" :key="index">
         <div class="project-blocks-gap" :data-size="gapSize(index)" aria-hidden="true" />
         <ProjectTextBlock v-if="block.type === 'text'" :block="block" />
         <ProjectTitleBlock v-else-if="block.type === 'title'" :block="block" />
         <ProjectMedia v-else-if="block.type === 'media'" :media="block.media" />
         <ProjectGridBlock v-else-if="block.type === 'grid'" :block="block" />
         <ProjectResultsBlock v-else :block="block" />
      </template>
   </section>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.project-blocks {
   @apply flex flex-col;
}

.project-blocks-gap {
   @apply h-25;
}

.project-blocks-gap[data-size="close"] {
   @apply h-4;
}

.project-blocks-gap[data-size="section"] {
   @apply h-50;
}
</style>
