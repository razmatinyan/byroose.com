<script setup lang="ts">
import { computed } from "vue";
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

const gallery = useProjectGallery();
const viewLabel = computed(() => {
   const action = media.kind === "video" ? "Watch with sound" : "View full size";
   return media.alt ? `${action}: ${media.alt}` : action;
});

function openMedia() {
   gallery?.open(media);
}

function showHint() {
   if (media.kind === "video") gallery?.showVideoHint();
}

function hideHint() {
   if (media.kind === "video") gallery?.hideVideoHint();
}
</script>

<template>
   <button
      v-if="gallery"
      type="button"
      class="project-media-trigger"
      :aria-label="viewLabel"
      @click="openMedia"
      @pointerenter="showHint"
      @pointerleave="hideHint"
   >
      <NuxtImg
         v-if="media.kind === 'image'"
         :src="media.src"
         alt=""
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
         class="project-media"
         aria-hidden="true"
         preload="metadata"
         autoplay
         muted
         loop
         playsinline
      />
   </button>
   <NuxtImg
      v-else-if="media.kind === 'image'"
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

.project-media-trigger {
   @apply block w-full cursor-pointer rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50;
}
</style>
