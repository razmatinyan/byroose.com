<script setup lang="ts">
import type { ProjectBlock } from "@/lib/projects";
import ProjectGridBlock from "./ProjectGridBlock.vue";
import ProjectMedia from "./ProjectMedia.vue";
import ProjectResultsBlock from "./ProjectResultsBlock.vue";
import ProjectTextBlock from "./ProjectTextBlock.vue";

const { blocks } = defineProps<{
   blocks: readonly ProjectBlock[];
}>();

const mediaBlockTypes = new Set<ProjectBlock["type"]>(["media", "grid"]);

function isCloseGap(index: number) {
   const block = blocks[index];
   const previous = blocks[index - 1];
   if (!block || !mediaBlockTypes.has(block.type)) return false;

   return !previous || mediaBlockTypes.has(previous.type);
}
</script>

<template>
   <section v-if="blocks.length" class="project-blocks section-gutter" aria-label="Project story">
      <template v-for="(block, index) in blocks" :key="index">
         <div class="project-blocks-gap" :data-close="isCloseGap(index) || undefined" aria-hidden="true" />
         <ProjectTextBlock v-if="block.type === 'text'" :block="block" />
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

.project-blocks-gap[data-close] {
   @apply h-4;
}
</style>
