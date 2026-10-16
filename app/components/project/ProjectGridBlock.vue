<script setup lang="ts">
import { computed } from "vue";
import type { ProjectGridBlock } from "@/lib/projects";
import ProjectMedia from "./ProjectMedia.vue";

const { block } = defineProps<{
   block: ProjectGridBlock;
}>();

const columns = computed(() => block.columns ?? 2);
const imageSizes = computed(() =>
   columns.value === 3
      ? "sm:640px md:640px lg:448px xl:640px 2xl:768px"
      : "sm:640px md:640px lg:640px xl:768px 2xl:1024px",
);
</script>

<template>
   <div class="grid-block" :data-columns="columns">
      <ProjectMedia
         v-for="image in block.images"
         :key="image.src"
         :media="image"
         :sizes="imageSizes"
      />
   </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.grid-block {
   @apply grid grid-cols-1 items-start gap-4 sm:grid-cols-2;
}

.grid-block[data-columns="3"] {
   @apply lg:grid-cols-3;
}
</style>
