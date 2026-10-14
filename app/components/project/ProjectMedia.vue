<script setup lang="ts">
import type { ProjectMedia } from "@/lib/projects";

const {
   media,
   sizes = "sm:640px md:768px lg:1024px xl:1280px 2xl:1536px",
   loading = "lazy",
} = defineProps<{
   media: ProjectMedia;
   sizes?: string;
   loading?: "lazy" | "eager";
}>();
</script>

<template>
   <NuxtImg
      v-if="media.kind === 'image'"
      :src="media.src"
      :alt="media.alt"
      :width="media.width"
      :height="media.height"
      :sizes="sizes"
      densities="x1"
      :loading="loading"
      class="project-media"
   />
   <video
      v-else
      :src="media.src"
      :poster="media.poster"
      :width="media.width"
      :height="media.height"
      :aria-label="media.alt || undefined"
      class="project-media"
      preload="metadata"
      autoplay
      muted
      loop
      playsinline
   />
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

.project-media {
   @apply block h-auto w-full rounded-lg;
}
</style>
