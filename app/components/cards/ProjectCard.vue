<script setup lang="ts">
import { computed } from "vue";

export interface ProjectImage {
   height: number;
   src: string;
   width: number;
}

const { categories, image, imageAlt, name } = defineProps<{
   categories: readonly string[];
   image: ProjectImage;
   imageAlt: string;
   name: string;
}>();

const emit = defineEmits<{
   activate: [];
   deactivate: [];
}>();

const categoryLabel = computed(() => `(${categories.join(", ")})`);
</script>

<template>
   <article
      class="project-card"
      data-work-project
      @pointerenter="emit('activate')"
      @pointerleave="emit('deactivate')"
   >
      <div class="project-card-media" data-work-project-media>
         <NuxtImg
            class="project-card-image"
            :src="image.src"
            :alt="imageAlt"
            :width="image.width"
            :height="image.height"
            sizes="sm:1024px md:1024px lg:768px xl:1024px 2xl:1536px"
            densities="x1"
            loading="lazy"
            draggable="false"
         />
      </div>
      <div class="project-card-meta-mask">
         <div class="project-card-meta" data-work-project-meta>
            <h3 class="project-card-title">{{ name }}</h3>
            <p class="project-card-categories">{{ categoryLabel }}</p>
         </div>
      </div>
   </article>
</template>

<style scoped>
@reference '../../assets/css/tailwind.css';

.project-card {
   @apply flex cursor-pointer flex-col gap-4 md:gap-5;
}

.project-card-media {
   @apply relative aspect-4/3 overflow-hidden rounded-2xl bg-muted;
}

.project-card-image {
   @apply absolute inset-0 size-full object-cover select-none;
}

.project-card-meta-mask {
   @apply overflow-clip;
   margin-block: -0.15em;
   padding-block: 0.15em;
}

.project-card-meta {
   @apply flex items-baseline justify-between gap-x-6 text-lg leading-tight tracking-[-0.02em] md:text-xl;
}

.project-card-title {
   @apply m-0 font-semibold;
}

.project-card-categories {
   @apply m-0 text-right font-medium text-brand-subtle;
}

@media (hover: hover) {
   .project-card-image {
      transition: scale 0.8s cubic-bezier(0.19, 1, 0.22, 1);
   }

   .project-card:hover .project-card-image {
      scale: 1.06;
   }
}

@media (prefers-reduced-motion: reduce) {
   .project-card-image {
      transition: none;
   }
}
</style>
